import { lazyPaths, paths } from '@vidstack/icons';
import { effect, peek, signal } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';

import type { MediaIconElement } from './types';

export const MediaIconDefinition = defineCustomElement<MediaIconElement>({
  tagName: 'media-icon',
  props: {
    type: {},
    size: { initial: 32 },
  },
  setup({ host, props: { $type, $size }, accessors }) {
    const $paths = signal<string>('');

    if (__SERVER__) {
      const type = $type();
      if (type && paths[type]) $paths.set(paths[type]);
    }

    onAttach(() => {
      let hydrate = host.el!.hasAttribute('mk-h');
      effect(() => {
        const type = $type();

        if (hydrate) {
          hydrate = false;
          return;
        }

        if (type && lazyPaths[type]) {
          lazyPaths[type]().then(({ default: paths }) => {
            // Check type because it may have changed by the time the icon loads.
            if (type === peek($type)) $paths.set(paths);
          });
        } else $paths.set('');
      });
    });

    return mergeProperties(accessors(), {
      $render: () => (
        <svg
          width={$size()}
          height={$size()}
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          $prop:innerHTML={$paths}
        ></svg>
      ),
    });
  },
});
