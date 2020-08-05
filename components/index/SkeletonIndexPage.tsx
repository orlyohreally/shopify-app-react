import React from 'react';
import { Banner, Card, CalloutCard, Layout, SkeletonBodyText, SkeletonPage } from '@shopify/polaris';

function SkeletonIndexPage() {
    return (
        <SkeletonPage fullWidth={true} title="Banner setup">
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
                        <SkeletonBodyText />
                    </Card>
                </Layout.AnnotatedSection>
                <Layout.AnnotatedSection title="Banner configuration">
                    <Card sectioned >
                        <SkeletonBodyText />
                    </Card>
                </Layout.AnnotatedSection>
                <Layout.AnnotatedSection title="Banner layout">
                    <Card sectioned>
                            <SkeletonBodyText />
                    </Card>
                </Layout.AnnotatedSection>
            </Layout>
        </SkeletonPage>
    );
}

export default SkeletonIndexPage;