import { computed } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';

import { formatTime } from '../../../utils/time';
import { useMedia } from '../../media/context';
import type { MediaStore } from '../../media/store';
import { timeProps } from './props';
import type { MediaTimeElement, TimeProps } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-time': MediaTimeElement;
  }
}

export const TimeDefinition = defineCustomElement<MediaTimeElement>({
  tagName: 'media-time',
  props: timeProps,
  setup({ props: { $remainder, $padHours, $padMinutes, $showHours, $type } }) {
    const $media = useMedia().$store;

    const $formattedTime = computed(() => {
      const seconds = getSeconds($type(), $media),
        duration = $media.duration;

      if (!Number.isFinite(seconds + duration)) return 'LIVE';

      const time = $remainder() ? Math.max(0, duration - seconds) : seconds;
      return formatTime(time, $padHours(), $padMinutes(), $showHours());
    });

    return () => <span>{$formattedTime()}</span>;
  },
});

function getSeconds(type: TimeProps['type'], $media: MediaStore) {
  switch (type) {
    case 'buffered':
      return $media.bufferedEnd;
    case 'duration':
      return $media.duration;
    default:
      return $media.currentTime;
  }
}
