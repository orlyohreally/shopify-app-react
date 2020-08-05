import App from "next/app";
import Head from "next/head";
import React, { Fragment } from 'react';
import { AppProvider } from "@shopify/polaris";
import { Provider, TitleBar } from "@shopify/app-bridge-react";
import Cookies from "js-cookie";
import translations from "@shopify/polaris/locales/en.json";
// import { ApolloClient } from 'apollo-client';
// import { ApolloClient } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

declare const APP_URL: string;
declare const API_KEY: string;

const client = new ApolloClient({
    fetch,
    fetchOptions: {
        credentials: 'include'
    },
});

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        const config = {
            apiKey: API_KEY,
            appURL: APP_URL,
            shopOrigin: Cookies.get("shopOrigin"),
            forceRedirect: true,
        };
        console.log({ config });

        return (
            <React.Fragment>
                <Head>
                    <title>Sample App</title>
                    <meta charSet="utf-8" />
                    <link
                        rel="stylesheet"
                        href="https://unpkg.com/@shopify/polaris@4.7.0/styles.min.css"
                    />
                </Head>
                <Provider config={config}>
                    <AppProvider
                        i18n={translations}
                        theme={{
                            logo: {
                                width: 124,
                                contextualSaveBarSource:
                                    "https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999",
                            },
                        }}
                    >
                        <ApolloProvider client={client}>
                            <Component
                                {...{
                                    ...pageProps,
                                    apiKey: config.apiKey,
                                    shopOrigin: config.shopOrigin,
                                    appURL: config.appURL,
                                }}
                            />
                        </ApolloProvider>
                    </AppProvider>
                </Provider>
            </React.Fragment>
        );
    }
}

export default MyApp;
