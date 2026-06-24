import { mount } from '@vue/test-utils';
import { expect, test } from 'vitest';

import NotFound from '@/components/404.vue';

test('renders not found page', () => {
  const wrapper = mount(NotFound);

  expect(wrapper.text()).toContain('NOT-FOUND 404');
});
