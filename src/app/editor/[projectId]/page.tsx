import { protectServer } from '@/features/auth/utils';
import { EditorWrapper } from '@/features/editor/components/editor-wrapper';
import React from 'react'

const EditorProjectIdPage = async () => {
  await protectServer();
  return (
   <EditorWrapper />
  )
}

export default EditorProjectIdPage;
