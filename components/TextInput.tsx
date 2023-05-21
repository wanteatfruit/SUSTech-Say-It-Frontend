import { Button, Flex,Spacer,ButtonGroup, Textarea, HStack, VStack ,Text} from "@chakra-ui/react";
import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
const ReactQuill = dynamic(import('react-quill'), { ssr: false })

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['code-block'],
    ['link', 'image', 'video'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'code-block',
  'link',
  'image',
  'video',
]

export default function TextInput({ value, setValue}) {
  return (
      <Flex direction="column" pt={2}>
        <ReactQuill 
          theme="snow" 
          modules={modules} 
          formats={formats} 
          value={value} 
          onChange={setValue} 
          placeholder="输入你的内容"
        />
        {/* <div>{value}</div> */}
      </Flex>
  );
}