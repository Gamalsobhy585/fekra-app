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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="mb-8 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Posts Manager</h1>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleExport}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-150 ease-in-out shadow-sm"
                                type="button"
                            >
                                <DownloadCloud className="w-5 h-5 mr-2" />
                                Export to Excel
                            </button>

                            <form onSubmit={handleImport} className="flex items-center">
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-4 transition-colors duration-150 ease-in-out ${
                                        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                    }`}
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
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex items-center">
                                        <Upload className="w-5 h-5 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-600">
                                            {showFileName || 'Drop Excel file or click to upload'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!file}
                                    className={`ml-4 inline-flex items-center px-4 py-2 rounded-md transition duration-150 ease-in-out shadow-sm ${
                                        file
                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                            : 'bg-gray-300 cursor-not-allowed text-gray-500'
                                    }`}
                                >
                                    <FileSpreadsheet className="w-5 h-5 mr-2" />
                                    Import
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">Body</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {posts && posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{post.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 border border-gray-300">{post.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 border border-gray-300">{post.body}</td>
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