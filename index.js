// @ts-nocheck
import env from "$/server/env.js";

const render = env.puppeteer.renderer.worker
    ? (await import("$/server/utils/render_engine/proxy/index.js")).default
    : (await import("$/server/utils/render_engine/index.js")).default;

class EmailGenerator {
    template_name = "email";
    load_images_as_urls = true;
    app_name = env.client?.app_name;
    app_url = `http://${env.host?.domain_name}`;
    client_logo = env.client?.logo?.url;
    client_name = env.client?.name;
    our_logo = env.corp?.logo?.url;
    our_name = env.corp?.name;
    save = null;
    /**
     * @typedef {Object} MessageContentOptions
     * @property {String} [title]
     * @property {String} [subtitle]
     * @property {String} [text]
     */

    /**
     * @typedef {Object} EmailGenerateOptions
     * @property {String} [title]
     * @property {String} [subtitle]
     * @property {"ltr"|"rtl"} [direction]
     * @property {MessageContentOptions[]} [content]
     * @property {String} [ending_message]
     * @property {String} [app_url]
     * @property {String} [app_name]
     * @property {String} [client_name]
     * @property {String} [client_logo]
     * @property {String} [our_name]
     * @property {String} [our_logo]
     *
     */

    /**
     * @param {EmailGenerateOptions} options placement under public
     * @returns {Promise<import("$/server/utils/render_engine/index.js").RenderedDocumentSkeleton>}
     */
    async generate_document(options) {
        const skeleton = this.generate_skeleton(options);
        const Document = await render(skeleton);

        return Document;
    }

    /**
     * @param {EmailGenerateOptions} options placement under public
     * @returns {Promise<import("$/server/utils/render_engine/index.js").RenderedDocumentSkeleton>}
     */
    generate_skeleton(options) {
        /**
         * @type {import("$/server/utils/render_engine/index.js").DocumentSkeleton}
         */
        const Document = {
            content: [
                {
                    type: "email",
                    title: options.title,
                    subtitle: options.subtitle,
                    direction: options.direction,
                    content: options.content,
                    ending_message: options.ending_message,
                    app_url: options.app_url || this.app_url,
                    app_name: options.app_name || this.app_name,
                    client_logo: options.client_logo || this.client_logo,
                    client_name: options.client_name || this.client_name,
                    our_logo: options.our_logo || this.our_logo,
                    our_name: options.our_name || this.our_name,
                },
            ],
            data: {},
            no_puppeteer: true,
            save: this.save,
            style: {
                load_images: true,
                load_css: true,
                wrap: true,
                load_images_as_urls: this.load_images_as_urls,
            },
            template: {
                header: null,
                footer: null,
                name: this.template_name,
            },
        };
        return Document;
    }
}

export { EmailGenerator };
