import { useEffect, useRef, useState } from 'react';
//import RichTextEditor from '../RichText';
import { Editor } from '@mantine/rte';
import RichTextEditor from '../RichText';

type DescriptionSectionProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function DescriptionSection({
                                               value,
                                               onChange,
                                           }: DescriptionSectionProps) {
    const editorRef = useRef<Editor>(null);
    // to prevent hydration error
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    return <>
      { mounted ? <RichTextEditor
        value={value}
        onChange={onChange}
        ref={editorRef}
      /> : null }
           </>;
}
