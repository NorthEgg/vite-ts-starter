import { mount } from '@vue/test-utils';
import { expect, test } from 'vitest';

import NotFound from '@/components/404.vue';
import { i18n } from '@/locales';

test('renders not found page', () => {
  const wrapper = mount(NotFound);

  expect(wrapper.text()).toContain('404');
  expect(wrapper.text()).toContain(i18n.global.t('base.notFound'));
});
