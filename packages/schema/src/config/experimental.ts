import { defineUntypedSchema } from 'untyped'

export default defineUntypedSchema({
  experimental: {
    /**
     * Set to true to generate an async entry point for the Vue bundle (for module federation support).
     */
    asyncEntry: {
      $resolve: val => val ?? false
    },

    // TODO: Remove when nitro has support for mocking traced dependencies
    // https://github.com/unjs/nitro/issues/1118
    /**
     * Externalize `vue`, `@vue/*` and `vue-router` when building.
     * @see [Nuxt Issue #13632](https://github.com/nuxt/nuxt/issues/13632)
     */
    externalVue: true,

    /**
     * Tree shakes contents of client-only components from server bundle.
     * @see [Nuxt PR #5750](https://github.com/nuxt/framework/pull/5750)
     */
    treeshakeClientOnly: true,

    /**
     * Emit `app:chunkError` hook when there is an error loading vite/webpack
     * chunks.
     *
     * By default, Nuxt will also perform a hard reload of the new route
     * when a chunk fails to load when navigating to a new route.
     *
     * You can disable automatic handling by setting this to `false`, or handle
     * chunk errors manually by setting it to `manual`.
     * @see [Nuxt PR #19038](https://github.com/nuxt/nuxt/pull/19038)
     * @type {false | 'manual' | 'automatic'}
     */
    emitRouteChunkError: {
      $resolve: (val) => {
        if (val === true) {
          return 'manual'
        }
        if (val === 'reload') {
          return 'automatic'
        }
        return val ?? 'automatic'
      }
    },

    /**
     * By default the route object returned by the auto-imported `useRoute()` composable
     * is kept in sync with the current page in view in `<NuxtPage>`. This is not true for
     * `vue-router`'s exported `useRoute` or for the default `$route` object available in your
     * Vue templates.
     *
     * By enabling this option a mixin will be injected to keep the `$route` template object
     * in sync with Nuxt's managed `useRoute()`.
     */
    templateRouteInjection: true,

    /**
     * Whether to restore Nuxt app state from `sessionStorage` when reloading the page
     * after a chunk error or manual `reloadNuxtApp()` call.
     *
     * To avoid hydration errors, it will be applied only after the Vue app has been mounted,
     * meaning there may be a flicker on initial load.
     *
     * Consider carefully before enabling this as it can cause unexpected behavior, and
     * consider providing explicit keys to `useState` as auto-generated keys may not match
     * across builds.
     * @type {boolean}
     */
    restoreState: false,

    /**
     * Inline styles when rendering HTML (currently vite only).
     *
     * You can also pass a function that receives the path of a Vue component
     * and returns a boolean indicating whether to inline the styles for that component.
     * @type {boolean | ((id?: string) => boolean)}
     */
    inlineSSRStyles: {
      async $resolve (val, get) {
        if (val === false || (await get('dev')) || (await get('ssr')) === false || (await get('builder')) === '@nuxt/webpack-builder') {
          return false
        }
        // Enabled by default for vite prod with ssr
        return val ?? true
      }
    },

    /**
     * Turn off rendering of Nuxt scripts and JS resource hints.
     * You can also disable scripts more granularly within `routeRules`.
     */
    noScripts: false,

    /** Render JSON payloads with support for revivifying complex types. */
    renderJsonPayloads: true,

    /**
     * Disable vue server renderer endpoint within nitro.
     */
    noVueServer: false,

    /**
     * When this option is enabled (by default) payload of pages that are prerendered are extracted
     * @type {boolean | undefined}
     */
    payloadExtraction: true,

    /**
     * Whether to enable the experimental `<NuxtClientFallback>` component for rendering content on the client
     * if there's an error in SSR.
     */
    clientFallback: false,

    /** Enable cross-origin prefetch using the Speculation Rules API. */
    crossOriginPrefetch: false,

    /**
     * Enable View Transition API integration with client-side router.
     * @see [View Transitions API](https://developer.chrome.com/docs/web-platform/view-transitions)
     */
    viewTransition: false,

    /**
     * Write early hints when using node server.
     * @note nginx does not support 103 Early hints in the current version.
     */
    writeEarlyHints: false,

    /**
     * Experimental component islands support with <NuxtIsland> and .island.vue files.
     * @type {true | 'local' | 'local+remote' | Partial<{ remoteIsland: boolean, selectiveClient: boolean }> | false}
     */
    componentIslands: {
      $resolve: (val) => {
        if (val === 'local+remote') {
          return { remoteIsland: true }
        }
        if (val === 'local') {
          return true
        }
        return val ?? false
      }
    },

    /**
     * Config schema support
     * @see [Nuxt Issue #15592](https://github.com/nuxt/nuxt/issues/15592)
     */
    configSchema: true,

    /**
     * This enables 'Bundler' module resolution mode for TypeScript, which is the recommended setting
     * for frameworks like Nuxt and Vite.
     *
     * It improves type support when using modern libraries with `exports`.
     *
     * This is only not enabled by default because it could be a breaking change for some projects.
     *
     * See https://github.com/microsoft/TypeScript/pull/51669
     */
    typescriptBundlerResolution: {
      async $resolve (val, get) {
        if (typeof val === 'boolean') { return val }
        const setting = await get('typescript.tsConfig.compilerOptions.moduleResolution')
        if (setting) {
          return setting.toLowerCase() === 'bundler'
        }
        return false
      }
    },

    /**
     * Whether or not to add a compatibility layer for modules, plugins or user code relying on the old
     * `@vueuse/head` API.
     *
     * This can be disabled for most Nuxt sites to reduce the client-side bundle by ~0.5kb.
     */
    polyfillVueUseHead: false,

    /** Allow disabling Nuxt SSR responses by setting the `x-nuxt-no-ssr` header. */
    respectNoSSRHeader: false,

    /** Resolve `~`, `~~`, `@` and `@@` aliases located within layers with respect to their layer source and root directories. */
    localLayerAliases: true,

    /** Enable the new experimental typed router using [unplugin-vue-router](https://github.com/posva/unplugin-vue-router). */
    typedPages: false,

    /**
     * Use app manifests to respect route rules on client-side.
     */
    appManifest: true,

    // This is enabled when `experimental.payloadExtraction` is set to `true`.
    // appManifest: {
    //   $resolve: (val, get) => val ?? get('experimental.payloadExtraction')
    // },

    /**
     * Set an alternative watcher that will be used as the watching service for Nuxt.
     *
     * Nuxt uses 'chokidar-granular' by default, which will ignore top-level directories
     * (like `node_modules` and `.git`) that are excluded from watching.
     *
     * You can set this instead to `parcel` to use `@parcel/watcher`, which may improve
     * performance in large projects or on Windows platforms.
     *
     * You can also set this to `chokidar` to watch all files in your source directory.
     * @see [chokidar](https://github.com/paulmillr/chokidar)
     * @see [Parcel watcher](https://github.com/parcel-bundler/watcher)
     * @type {'chokidar' | 'parcel' | 'chokidar-granular'}
     */
    watcher: 'chokidar-granular',

    /**
     * Enable native async context to be accessible for nested composables
     * @see [Nuxt PR #20918](https://github.com/nuxt/nuxt/pull/20918)
     */
    asyncContext: false,

    /**
     * Use new experimental head optimisations:
     * - Add the capo.js head plugin in order to render tags in of the head in a more performant way.
     * - Uses the hash hydration plugin to reduce initial hydration
     * @see [Nuxt Discussion #22632](https://github.com/nuxt/nuxt/discussions/22632]
     */
    headNext: false,

    /**
     * Allow defining `routeRules` directly within your `~/pages` directory using `defineRouteRules`.
     *
     * Rules are converted (based on the path) and applied for server requests. For example, a rule
     * defined in `~/pages/foo/bar.vue` will be applied to `/foo/bar` requests. A rule in `~/pages/foo/[id].vue`
     * will be applied to `/foo/**` requests.
     *
     * For more control, such as if you are using a custom `path` or `alias` set in the page's `definePageMeta`, you
     * should set `routeRules` directly within your `nuxt.config`.
     */
    inlineRouteRules: false,

    /**
     * This allows specifying the default options for core Nuxt components and composables.
     *
     * These options will likely be moved elsewhere in the future, such as into `app.config` or into the
     * `app/` directory.
     */
    defaults: {
      /** @type {typeof import('#app/components/nuxt-link')['NuxtLinkOptions']} */
      nuxtLink: {
        componentName: 'NuxtLink'
      },
      /**
       * Options that apply to `useAsyncData` (and also therefore `useFetch`)
       */
      useAsyncData: {
        deep: true
      },
      /** @type {Pick<typeof import('ofetch')['FetchOptions'], 'timeout' | 'retry' | 'retryDelay' | 'retryStatusCodes'>} */
      useFetch: {}
    }
  }
})
