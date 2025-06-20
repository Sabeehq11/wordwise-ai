import React, { useState, useRef, useEffect } from 'react';
import { FiUpload, FiDownload, FiFileText, FiFile } from 'react-icons/fi';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import mammoth from 'mammoth';
import { saveAs } from 'file-saver';

const DocumentToolbar = ({ text, setText, isVisible = true }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debug: Check if setText is a function
  console.log('DocumentToolbar props:', { 
    textLength: text?.length || 0, 
    setTextType: typeof setText, 
    isVisible 
  });

  if (!isVisible) return null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  // Debug: Monitor text changes
  useEffect(() => {
    console.log('DocumentToolbar text changed:', text?.length || 0, 'characters');
  }, [text]);

  // Import functionality
  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      let extractedText = '';

      console.log('Processing file:', file.name, 'Extension:', fileExtension, 'Size:', file.size);

      switch (fileExtension) {
        case 'txt':
          console.log('Reading TXT file...');
          extractedText = await file.text();
          console.log('TXT file read successfully');
          break;
        
        case 'docx':
          console.log('Reading DOCX file...');
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          extractedText = result.value;
          console.log('DOCX file read successfully');
          break;
        
        case 'pdf':
          // For PDF, we'll use a simpler approach since pdf-parse is complex in browser
          alert('PDF import is coming soon! Please convert your PDF to TXT or DOCX for now.');
          setIsProcessing(false);
          return;
        
        default:
          alert('Unsupported file format. Please use .txt, .docx, or .pdf files.');
          setIsProcessing(false);
          return;
      }

      // Debug logging
      console.log('Extracted text length:', extractedText.length);
      console.log('Extracted text preview:', extractedText.substring(0, 100));

      // Check if we actually got text
      if (!extractedText || extractedText.trim().length === 0) {
        alert('No text content found in the file. Please check if the file contains readable text.');
        setIsProcessing(false);
        return;
      }

      // Check if there's existing text
      if (text.trim()) {
        const confirmOverwrite = window.confirm(
          'You have existing text in the editor. Do you want to:\n\n' +
          '• OK: Replace the existing text\n' +
          '• Cancel: Append to existing text'
        );
        
        if (confirmOverwrite) {
          console.log('Setting text (overwrite):', extractedText);
          setText(extractedText);
        } else {
          const newText = text + '\n\n' + extractedText;
          console.log('Setting text (append):', newText);
          setText(newText);
        }
      } else {
        console.log('Setting text (initial):', extractedText);
        setText(extractedText);
      }

      // Success message
      alert(`Successfully imported ${extractedText.length} characters from ${file.name}`);

      // Clear the file input
      event.target.value = '';
    } catch (error) {
      console.error('Error importing file:', error);
      alert('Error importing file. Please try again or use a different file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Export functionality
  const exportAsPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxLineWidth = pageWidth - (margin * 2);
      
      // Split text into lines that fit the page width
      const lines = doc.splitTextToSize(text || 'Empty document', maxLineWidth);
      let y = margin;
      
      // Add title
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Document Export', margin, y);
      y += 20;
      
      // Add content
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      
      lines.forEach((line) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 7;
      });
      
      doc.save('document.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    }
  };

  const exportAsDOCX = async () => {
    try {
      // Split text into paragraphs
      const paragraphs = (text || 'Empty document').split('\n').map(paragraph => 
        new Paragraph({
          children: [new TextRun(paragraph || ' ')], // Empty paragraphs need at least a space
        })
      );

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'document.docx');
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      alert('Error exporting DOCX. Please try again.');
    }
  };

  const exportAsTXT = () => {
    try {
      const blob = new Blob([text || 'Empty document'], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'document.txt');
    } catch (error) {
      console.error('Error exporting TXT:', error);
      alert('Error exporting TXT. Please try again.');
    }
  };

  const handleExport = (format) => {
    setShowExportMenu(false);
    switch (format) {
      case 'pdf':
        exportAsPDF();
        break;
      case 'docx':
        exportAsDOCX();
        break;
      case 'txt':
        exportAsTXT();
        break;
      default:
        console.error('Unknown export format:', format);
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      marginBottom: '16px'
    }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.docx,.pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Import Button */}
      <button
        onClick={handleImport}
        disabled={isProcessing}
        title="Import Document (.txt, .docx, .pdf)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: isProcessing 
            ? 'linear-gradient(135deg, #a0a0a0 0%, #888888 100%)'
            : 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          boxShadow: isProcessing 
            ? '0 4px 16px rgba(160, 160, 160, 0.3)'
            : '0 4px 16px rgba(85, 239, 196, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if (!isProcessing) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(85, 239, 196, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isProcessing) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 16px rgba(85, 239, 196, 0.3)';
          }
        }}
      >
        {isProcessing ? (
          <>
            <div style={{
              width: '14px',
              height: '14px',
              border: '2px solid white',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Processing...
          </>
        ) : (
          <>
            <FiUpload style={{ width: '16px', height: '16px' }} />
            Import Document
          </>
        )}
      </button>

      {/* Export Button with Dropdown */}
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          title="Export Document"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(253, 121, 168, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(253, 121, 168, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 16px rgba(253, 121, 168, 0.3)';
          }}
        >
          <FiDownload style={{ width: '16px', height: '16px' }} />
          Export As
        </button>

        {/* Export Dropdown Menu */}
        {showExportMenu && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: '8px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            minWidth: '160px',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => handleExport('pdf')}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                color: '#2d3436',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <FiFileText style={{ width: '16px', height: '16px', color: '#e74c3c' }} />
              Export as PDF
            </button>
            <button
              onClick={() => handleExport('docx')}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                color: '#2d3436',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <FiFile style={{ width: '16px', height: '16px', color: '#3498db' }} />
              Export as DOCX
            </button>
            <button
              onClick={() => handleExport('txt')}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                color: '#2d3436',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <FiFileText style={{ width: '16px', height: '16px', color: '#95a5a6' }} />
              Export as TXT
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DocumentToolbar;
