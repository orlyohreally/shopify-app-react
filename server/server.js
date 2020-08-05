require('isomorphic-fetch');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaBody = require('koa-body');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const dotenv = require('dotenv');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const compose = require('koa-compose');
const Butter = require('buttercms');
const mongoose = require('mongoose');

dotenv.config();
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const { ShopModel } = require('./models');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

const router = new KoaRouter();

const storeProducts = {};

router.get('/api/banner-config', verifyRequest(), async ctx => {
  try {
    const { shop } = ctx.session;
    console.log(shop);
    const configs = await ShopModel.findOne({ name: shop }).exec();
    // .exec((error, configs) => {
    console.log({ configs });
    ctx.status = 200;
    ctx.body = {
      displayScope: configs.displayScope,
      position: configs.position,
      pageSlug: configs.pageSlug,
      butterCMSToken: configs.butterCMSToken,
      active: configs.active,
    };
    // });
  } catch (error) {
    console.log(error);
  }
});

router.post('/api/banner-config', compose([KoaBody(), verifyRequest()]), async ctx => {
  try {
    const { shop } = ctx.session;
    const { configs } = ctx.request.body;
    console.log('saving configs', { config });
    console.log(shop, configs);
    await ShopModel.findOneAndUpdate(
      { name: shop },
      {
        displayScope: configs.displayScope,
        position: configs.position,
        pageSlug: configs.pageSlug,
        butterCMSToken: configs.butterCMSToken,
        active: configs.active,
      }
    ); //.exec();
    // update scripttags
    ctx.status = 200;
    ctx.body = {
      message: 'Banner configs were saved',
    };
  } catch (error) {
    console.log(error);
  }
});

router.get('/api/products', verifyRequest(), async ctx => {
  try {
    const { shop } = ctx.request.query;
    console.log(shop);
    // if (!shop) {
    //   ctx.body = {
    //     status: 403,
    //     data: "Shop not set",
    //   };
    //   return;
    // }
    const pageSlug = 'shopify-banner';
    const butter = Butter('0b9c4b4952f6c442e769a817a593810f6059ea9b');
    const { body, styles } = (
      await butter.page.retrieve('*', pageSlug, {
        locale: 'en',
        preview: 1,
      })
    ).data.data.fields;
    console.log({ body, styles });

    ctx.body = { body, styles };
  } catch (error) {
    console.log(error);
  }
});

router.post('/api/products', compose([KoaBody(), verifyRequest()]), async ctx => {
  try {
    const { products } = ctx.request.body;
    console.log({ products });
    const { shop } = ctx.session;
    console.log({ shop });
    if (!shop) {
      ctx.body = {
        status: 403,
        data: 'Shop not set',
      };
      return;
    }
    if (!products || !products.length) {
      ctx.body = {
        status: 403,
        data: 'Products not set',
      };
      return;
    }
    storeProducts[shop] = [...(storeProducts[shop] || []), ...products];
    console.log('products added', storeProducts);
    ctx.body = 'Products added';
  } catch (error) {
    console.log(error);
  }
});

router.delete('/api/products', compose([KoaBody(), verifyRequest()]), async ctx => {
  try {
    const { shop } = ctx.session;
    // const { shop } = ctx.request.query;
    if (!shop) {
      ctx.body = {
        status: 403,
        data: 'Shop not set',
      };
      return;
    }
    delete storeProducts[shop];
    ctx.body = 'All products deleted';
  } catch (error) {
    console.log(error);
  }
});

const server = new Koa();
// Router Middleware
server.use(router.allowedMethods());
server.use(router.routes());

app.prepare().then(() => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('Connected to mongo');
    });

  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products', 'write_products', 'read_script_tags', 'write_script_tags'],
      afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set('shopOrigin', shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none',
        });

        const shopModel = ShopModel({
          name: shop,
          accessToken: accessToken,
        });
        shopModel.save();

        ctx.redirect('/');
      },
    })
  );

  server.use(graphQLProxy({ version: ApiVersion.October19 }));
  server.use(verifyRequest());

  server.use(async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
