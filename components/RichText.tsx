import { ForwardedRef, forwardRef } from 'react';
import { Editor, RichTextEditorProps } from '@mantine/rte';

export default forwardRef((props: RichTextEditorProps, ref: ForwardedRef<Editor>) => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line import/extensions, global-require
    const { RichTextEditor } = require('@mantine/rte');
    return <RichTextEditor {...props} ref={ref} />;
  }

  // Render anything as fallback on server, e.g. loader or html content without editor
  return null;
});
