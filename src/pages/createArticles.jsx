import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  imagePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  InsertImage
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

export default function CreateArticle() {
    const [markdown, setMarkdown] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const navigate = useNavigate();

    const handleDownload = () => {
        if (!title || !author) {
            alert("Title and Author are required.");
            return;
        }

        // Format date as DD/MM/YY
        const [year, month, day] = date.split('-');
        const formattedDate = `${day}/${month}/${year.slice(2)}`;
        
        const metadata = `| Title | Author | Date |\n|-------|--------|------|\n| ${title} | ${author} | ${formattedDate} |\n\n`;
        const blob = new Blob([metadata + markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="create-article-page" style={{ padding: "2rem" }}>
            <h1>Create a New Article</h1>

            <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Author</label>
                <input
                    type="text"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{ padding: "0.5rem", marginTop: "0.3rem" }}
                />
            </div>

            <div className="editor-container" style={{ marginBottom: "1rem" }}>
                <MDXEditor 
                    markdown={markdown} 
                    onChange={setMarkdown}
                    contentEditableClassName="prose"
                    plugins={[
                        headingsPlugin(),
                        listsPlugin(),
                        linkPlugin(),
                        quotePlugin(),
                        tablePlugin(),
                        thematicBreakPlugin(),
                        codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
                        codeMirrorPlugin({ codeBlockLanguages: { 
                            js: 'JavaScript', 
                            ts: 'TypeScript',
                            py: 'Python',
                            java: 'Java',
                            cpp: 'C++',
                            cs: 'C#',
                            css: 'CSS',
                            html: 'HTML',
                            xml: 'XML',
                            json: 'JSON',
                            md: 'Markdown',
                            txt: 'text' 
                        }}),
                        imagePlugin(),
                        markdownShortcutPlugin(),
                        toolbarPlugin({
                            toolbarContents: () => (
                                <>
                                    <UndoRedo />
                                    <BoldItalicUnderlineToggles />
                                    <ListsToggle />
                                    <BlockTypeSelect />
                                    <CreateLink />
                                    <InsertTable />
                                    <InsertImage />
                                </>
                            )
                        })
                    ]}
                    style={{ 
                        height: "400px", 
                        border: "1px solid #ccc", 
                        borderRadius: "4px",
                        overflow: "auto",
                        backgroundColor: "#fff"
                    }}
                />
            </div>

            <div className="button-group" style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <button 
                    onClick={handleDownload}
                    style={{
                        padding: "0.5rem 1rem",
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Download Markdown
                </button>
                <button 
                    onClick={() => navigate('/')}
                    style={{
                        padding: "0.5rem 1rem",
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}