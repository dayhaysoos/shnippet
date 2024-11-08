import { I as InlineConfig } from './reporters.anwo7Y6a.js';

type VitestInlineConfig = InlineConfig;
declare module 'vite' {
    interface UserConfig {
        /**
         * Options for Vitest
         */
        test?: VitestInlineConfig;
    }
}
