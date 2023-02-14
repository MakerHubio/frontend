import { Checkbox, MultiSelect, Space, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { forwardRef, Ref, useImperativeHandle } from 'react';

type GeneralSectionProps = {};
export type GeneralSectionElement = {
    getData: () => any;
};

function GeneralSection(props: GeneralSectionProps, ref: Ref<GeneralSectionElement | undefined>) {
    const form = useForm({
        initialValues: {
            name: '',
            is_free: true,
            tags: [] as string[],
        },
        validate: {
            name: (value) => value.trim().length > 5,
        },
    });

    useImperativeHandle(ref, () => ({
        getData: () => {
            if (form.validate()) {
                return form.values;
            }
            return null;
        },
    }));

    return <>
        <TextInput
          label="Name"
          required
          description="Name of your project. Choose wisely as this will be the main criteria to find you project"
          {...form.getInputProps('name')}
        />
        <Space h="sm" />
        <Checkbox label="This project is free" checked={form.values.is_free} {...form.getInputProps('is_free')} />
        { !form.values.is_free ? <>
            <Space h="sm" />
            <TextInput label="Price" description="Keep in mind that a price, especially a larger one tends to prevent user from downloading your project. Consider selling only the source files. You can do this below." />
                                 </> : null }
        <Space h="sm" />
        <MultiSelect
          searchable
          creatable
          getCreateLabel={(query) => `+ Add ${query}`}
          label="Tags"
          description="Select as much tags as possible which fit your project"
          onCreate={value => {
              const item = { value: value, label: value };
              form.values.tags.push(value);
              return item;
          }}
          data={[]}
          {...form.getInputProps('tags')}
        />
           </>;
}

export default forwardRef(GeneralSection);
