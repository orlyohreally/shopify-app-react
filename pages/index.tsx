import React, { Component, useState, useCallback } from "react";
import {
  Layout,
  // ContextualSaveBar,
  Frame,
  Page,
  CalloutCard,
  Card,
} from "@shopify/polaris";
import { ContextualSaveBar, Unsubscribe } from '@shopify/app-bridge/actions';
import BannerConfigForm from '../components/index/BannerConfigForm';
import BannerLayoutForm from '../components/index/BannerLayoutForm';
import ButterCMSConfigForm from '../components/index/ButterCMSConfigForm';
import SkeletonIndexPage from "@components/index/SkeletonIndexPage";
import createApp from '@shopify/app-bridge';

const axios = require("axios");

interface IProps {
  apiKey: string;
  shopOrigin: string;
}

interface IState {
  isLoading: boolean;
  butterCMSToken?: string;
  pageSlug?: string;
  displayScope?: string;
  active: boolean;
  position?: string;
  isDirty: boolean;
  isSaving: boolean;
}

class Index extends Component<IProps, IState> {
  contextualSaveBar: ContextualSaveBar.ContextualSaveBar;

  constructor(props: IProps) {
    super(props);
    this.state = {
      isLoading: true,
      butterCMSToken: "",
      pageSlug: "shopify-banner",
      displayScope: "ORDER_STATUS",
      active: false,
      position: "center",
      isDirty: false,
      isSaving: false
    };

    const options = {
      saveAction: {
        disabled: false,
        loading: false,
      },
      discardAction: {
        disabled: false,
        loading: false,
        discardConfirmationModal: false,
      },
    };
    const app = createApp({
      apiKey: this.props.apiKey,
      shopOrigin: this.props.shopOrigin,
    });
    this.contextualSaveBar = ContextualSaveBar.create(app, options);

    this.contextualSaveBar.subscribe(
      ContextualSaveBar.Action.DISCARD,
      () => {
        // // Hide the contextual save bar
        // contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
        // // Do something with the discard action
        this.handleDiscard()
      }
    );
    
    this.contextualSaveBar.subscribe(
      ContextualSaveBar.Action.SAVE,
      () => {
        // // Hide the contextual save bar
        // contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
        // // Do something with the discard action
        this.handleSave();
      }
    );
  }

  componentWillUnmount() {
    this.contextualSaveBar.unsubscribe();
  }

  // const [isDirty, setIsDirty] = useState(false);
  // const [configs, setConfigs] = useState({

  // });

  componentDidMount() {
    console.log("componentDidMount");



    this.getConfigs()
      .then((bannerConfigs) => {
        console.log("bannerConfigs", { bannerConfigs });
        // setConfigs(bannerConfigs);
        this.setState({
          ...this.state,
          isLoading: false,
          butterCMSToken: bannerConfigs.butterCMSToken,
          pageSlug: bannerConfigs.pageSlug,
          displayScope: bannerConfigs.displayScope,
          active: bannerConfigs.active,
          position: bannerConfigs.position,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getConfigs() {
    console.log({ propsPage: this.props });

    const url = "/api/banner-config";
    return axios
      .get(url)
      .then((result) => {
        console.log({ result });
        return result.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async saveConfigs(configs) {
    const url = "/api/banner-config";
    this.setState({ ...this.state, isSaving: true });


    // return axios
    //   .post(url, { configs })
    //   .then((result) => {
    //     console.log({ result });
    //     return result;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  // const handleDiscard = useCallback(() => {
  //   console.log("discard");
  //   setIsDirty(false);
  // }, []);

  // const handleSave = useCallback(() => {
  //   console.log("handleSave");
  //   setIsDirty(false);
  //   saveConfigs(configs);
  // }, []);
  // const handleSave = useCallback(() => {
  //   console.log("handleSave");
  //   setIsDirty(false);
  //   saveConfigs(configs);
  // }, []);

  // const onFormUpdated = useCallback(
  //   (changes) => {
  //     console.log("onFormUpdated");
  //     setConfigs({ ...configs, [changes.field]: changes.value });
  //     setIsDirty(true);
  //   },
  //   [configs]
  // );

  handleDiscard() {
    console.log("discard");
    // setIsDirty(false);
    this.setState({ ...this.state, isDirty: false });
  }

  handleSave() {
    console.log("handleSave");
    // setIsDirty(false);
    // this.setState({ ...this.state, isDirty: false }, () => {
    //   console.log("going to save ", this.state, {
    //     butterCMSToken: this.state.butterCMSToken,
    //     pageSlug: this.state.pageSlug,
    //     displayScope: this.state.displayScope,
    //     isShown: this.state.active,
    //     position: this.state.position,
    //   });
    this.contextualSaveBar.dispatch(ContextualSaveBar.Action.SHOW);
    this.contextualSaveBar.set({ saveAction: { loading: true } });

    this.saveConfigs({
      butterCMSToken: this.state.butterCMSToken,
      pageSlug: this.state.pageSlug,
      displayScope: this.state.displayScope,
      active: this.state.active,
      position: this.state.position,
    })
      .then((response) => {
        this.contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
        console.log("saved", response);
      })
      .catch((error) => {
        this.contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
        console.log(error);
      });
    // this.setState({ ...this.state, isDirty: false });
    // });
  }

  onFormUpdated(changes) {
    // setConfigs({ ...this.state, [changes.field]: changes.value });
    this.setState(
      { ...this.state, [changes.field]: changes.value, isDirty: true },
      () => {
        console.log("onFormUpdated", this.state, {
          ...this.state,
          [changes.field]: changes.value,
        });
      }
    );

    this.contextualSaveBar.dispatch(ContextualSaveBar.Action.SHOW);



    // setIsDirty(true);
  }

  render() {
    return (
      <div style={{ height: "500px" }}>
        <Frame>
          {this.state.isDirty ? (
            // <ContextualSaveBar
            //   fullWidth
            //   alignContentFlush={true}
            //   message="Unsaved changes"
            //   saveAction={{
            //     onAction: this.handleSave.bind(this),
            //     loading: this.state.isSaving
            //   }}
            //   discardAction={{
            //     onAction: this.handleDiscard.bind(this),
            //   }}
            // />
            <div>CHanged</div>
          ) : null}
          {this.state.isLoading ? <SkeletonIndexPage></SkeletonIndexPage> :
            (<Page title="Banner setup">
              <Layout>
                <Layout.Section>
                  <CalloutCard
                    title="Customize the style of your checkout"
                    illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                    primaryAction={{
                      content: "Customize checkout",
                      url: "https://www.shopify.com",
                    }}
                  >
                    <p>
                      Upload your store’s logo, change colors and fonts, and more.
                  </p>
                  </CalloutCard>
                </Layout.Section>
                <Layout.AnnotatedSection title="ButterCMS account">
                  <Card sectioned>
                    <ButterCMSConfigForm
                      formUpdated={this.onFormUpdated.bind(this)}
                    ></ButterCMSConfigForm>
                  </Card>
                </Layout.AnnotatedSection>
                <Layout.AnnotatedSection
                  title="Banner configuration"
                  description="Set ButterCMS to be used as a banner"
                >
                  <Card sectioned>
                    <BannerConfigForm
                      pageSlug={this.state.pageSlug}
                      displayScope={this.state.displayScope}
                      active={this.state.active}
                      formUpdated={this.onFormUpdated.bind(this)}
                    ></BannerConfigForm>
                  </Card>
                </Layout.AnnotatedSection>
                <Layout.AnnotatedSection
                  title="Banner layout"
                  description="Set layout of the banner"
                >
                  <Card sectioned>
                    <BannerLayoutForm
                      position={this.state.position}
                      formUpdated={this.onFormUpdated.bind(this)}
                    ></BannerLayoutForm>
                  </Card>
                </Layout.AnnotatedSection>
              </Layout>
            </Page>)}
        </Frame>
      </div>
    );
  }
}

export default Index;
