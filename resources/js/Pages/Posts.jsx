import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Upload, FileSpreadsheet, DownloadCloud } from 'lucide-react';

const Posts = ({ posts }) => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showFileName, setShowFileName] = useState('');

    const handleExport = () => {
        window.location.href = '/export-posts';
    };

    const handleImport = (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        router.post('/import-posts', formData, {
            forceFormData: true,
            onSuccess: () => {
                router.visit('/posts');
                setShowFileName('');
                setFile(null);
            },
        });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith('.xlsx')) {
            setFile(droppedFile);
            setShowFileName(droppedFile.name);
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#F9FAFB',
            padding: '2rem 0',
        },
        wrapper: {
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '0 1rem',
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem',
        },
        header: {
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        title: {
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
        },
        buttonGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
        },
        exportButton: {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            backgroundColor: '#2563EB',
            color: 'white',
            borderRadius: '0.375rem',
            transition: 'background-color 150ms ease-in-out',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            cursor: 'pointer',
        },
        dropZone: {
            position: 'relative',
            border: '2px dashed',
            borderColor: isDragging ? '#3B82F6' : '#D1D5DB',
            borderRadius: '0.5rem',
            padding: '1rem',
            transition: 'all 150ms ease-in-out',
            backgroundColor: isDragging ? '#EFF6FF' : 'transparent',
        },
        fileInput: {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
        },
        uploadText: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.875rem',
            color: '#4B5563',
        },
        importButton: {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            marginLeft: '1rem',
            borderRadius: '0.375rem',
            transition: 'all 150ms ease-in-out',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            backgroundColor: file ? '#059669' : '#D1D5DB',
            color: file ? 'white' : '#6B7280',
            cursor: file ? 'pointer' : 'not-allowed',
        },
        table: {
            minWidth: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #E5E7EB',
        },
        tableHeader: {
            backgroundColor: '#EFF6FF',
        },
        th: {
            padding: '0.75rem 1.5rem',
            textAlign: 'left',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: '#374151',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: '1px solid #E5E7EB',
        },
        td: {
            padding: '1rem 1.5rem',
            fontSize: '0.875rem',
            color: '#111827',
            border: '1px solid #E5E7EB',
            whiteSpace: 'nowrap',
        },
        tdBody: {
            padding: '1rem 1.5rem',
            fontSize: '0.875rem',
            color: '#6B7280',
            border: '1px solid #E5E7EB',
        },
        iconMargin: {
            marginRight: '0.5rem',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Posts Manager</h1>
                        <div style={styles.buttonGroup}>
                            <button
                                onClick={handleExport}
                                style={styles.exportButton}
                                type="button"
                            >
                                <DownloadCloud style={styles.iconMargin} size={20} />
                                Export to Excel
                            </button>

                            <form onSubmit={handleImport} style={{ display: 'flex', alignItems: 'center' }}>
                                <div
                                    style={styles.dropZone}
                                    onDragOver={(e) => {
                                        handleDrag(e);
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={(e) => {
                                        handleDrag(e);
                                        setIsDragging(false);
                                    }}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            setFile(e.target.files[0]);
                                            setShowFileName(e.target.files[0].name);
                                        }}
                                        accept=".xlsx"
                                        style={styles.fileInput}
                                    />
                                    <div style={styles.uploadText}>
                                        <Upload style={styles.iconMargin} size={20} color="#9CA3AF" />
                                        <span>{showFileName || 'Drop Excel file or click to upload'}</span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!file}
                                    style={styles.importButton}
                                >
                                    <FileSpreadsheet style={styles.iconMargin} size={20} />
                                    Import
                                </button>
                            </form>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead style={styles.tableHeader}>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Title</th>
                                    <th style={styles.th}>Body</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts && posts.map((post) => (
                                    <tr key={post.id}>
                                        <td style={styles.td}>{post.id}</td>
                                        <td style={styles.td}>{post.title}</td>
                                        <td style={styles.tdBody}>{post.body}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Posts;