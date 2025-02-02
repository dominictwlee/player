import { computed, useContext } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';

import { round } from '../../../utils/number';
import { formatTime } from '../../../utils/time';
import { sliderValueFormattersContext } from '../slider/format';
import { useSliderStore } from '../slider/store';
import { sliderValueTextProps } from './props';
import type { MediaSliderValueElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-slider-value': MediaSliderValueElement;
  }
}

export const SliderValueDefinition = defineCustomElement<MediaSliderValueElement>({
  tagName: 'media-slider-value',
  props: sliderValueTextProps,
  setup({ props: { $type, $format, $decimalPlaces, $padHours, $padMinutes, $showHours } }) {
    const $slider = useSliderStore(),
      formatters = useContext(sliderValueFormattersContext);

    const $text = computed(() => {
      const value = $type() === 'current' ? $slider.value : $slider.pointerValue;
      const format = $format();
      if (format === 'percent') {
        const range = $slider.max - $slider.min;
        const percent = (value / range) * 100;
        return (formatters.percent ?? round)(percent, $decimalPlaces()) + '﹪';
      } else if (format === 'time') {
        return (formatters.time ?? formatTime)(value, $padHours(), $padMinutes(), $showHours());
      } else {
        return formatters.value?.(value) ?? value.toFixed(2);
      }
    });

    return () => <span>{$text()}</span>;
  },
});
