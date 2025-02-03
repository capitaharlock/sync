'use client';
import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import './specs-viewer-dark.css';

interface OpenApiViewerProps {
  spec: object;
}
// note: there is an open issue on swagger ui - see https://github.com/swagger-api/swagger-ui/issues/10212
const OpenApiViewer: React.FC<OpenApiViewerProps> = ({ spec }) => {
  return (
    <SwaggerUI 
      spec={spec} 
      supportedSubmitMethods={[]}
    />
  );
};

export default OpenApiViewer;