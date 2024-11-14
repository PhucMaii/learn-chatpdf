import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';

type Props = {
    label: string,
    title: string,
    items: string[],
    value: string,
    onChange: (value: string) => void;
}

export default function SelectComponent({label, title , items, onChange, value}: Props) {
  return (
    <Select onValueChange={onChange} value={value}>
        <SelectTrigger>
            <SelectValue placeholder={label}/>
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectLabel>
                    {title}
                </SelectLabel>

                {
                    items.map((item: string, index: number) => (
                        <SelectItem
                            key={index}
                            value={item}
                        >
                            {item}
                        </SelectItem>
                    ))
                }
            </SelectGroup>
        </SelectContent>
    </Select>
  )
}
