/// <reference path="../xw/xw.templates.settings.js" />
// 'use strict';

angular.module('foxwayApp')
  .service('Scantemplate', function Scantemplate(xw) {

    var settings = xw.templates.settings;

    var baseTemplate = {
        "service xrx_svc_general": {
            "string JobTemplateLanguageVersion": "4.2.00",
            "enum_encoding JobTemplateCharacterEncoding": "UTF-8",
            "enum_confmethod ConfirmationMethod": "PRINT",
            "enum_confstage ConfirmationStage": "AFTER_JOB_COMPLETE",
            "string JobTemplateDescription": "Template auto-generated by FW Workflow Scan",
            "string JobTemplateName": "FWWorkflowScan" + new Date().getTime() + ".xst",
            "string JobTemplateCreator": "",
            "enum_DCS DCSDefinitionUsed": "DCS_GENERIC",
            "boolean SuppressJobLog": "FALSE"
        },

        "service xrx_svc_scan" : {
            "boolean AutoContrast" : settings.scanAutoContrast.off,
            "integer Contrast": settings.scanContrast.zero,
            "enum_autoexposure AutoExposure" : settings.scanBackgroundSuppression.on,
            "integer CompressionQuality" : settings.scanCompressionQuality.higherLarger,
            "enum_colormode ColorMode": settings.scanColorMode.color,
            "integer Darkness": settings.scanDarkness.zero,
            "enum_imagemode DocumentImageMode" : settings.scanDocumentImageMode.text,
            "enum_originalsubtype OriginalSubType" : "PRINTED_ORIGINAL",
            "struct_borders InputEdgeErase" : "3/3/3/3/MM",
            "enum_mediasize InputMediaSize" : settings.mediaSize['8_5x11Landscape'],
            "enum_inputorientation InputOrientation" : settings.scanOriginalOrientation.portrait,
            "string outputUsage" : "sharePrint",
            "integer Sharpness": settings.scanSharpness.zero,
            "integer Saturation": settings.scanSaturation.zero,
            "enum_sided SidesToScan": settings.scanSides.simplex,
            "enum_blankpageremoval BlankPageRemoval" : "INCLUDE_ALL_PAGES"
        },

        "service xrx_svc_file": {
            "enum_filingpolicy DocumentFilingPolicy" : settings.filingPolicy.auto,
            "string RepositoryAlias" : "",
            "string DocumentPath" : "",
            "enum_loginsource LoginSource" : "TEMPLATE",
            "string NDSNameContext" : "",
            "string NDSTree" : "",
            "string RepositoryName" : "",
            "string RepositoryVolume" : "",
            "enum_filingprotocol FilingProtocol" : settings.scanFiling.ftp, // This value cannot be empty since it maps to an enum
            "string UserNetworkFilingLoginName" : "",
            "string UserNetworkFilingLoginID" : "",
            "boolean ServerValidationReq" : "FALSE",
            "string XrxHTTPScriptLocation" : "",
            "boolean DocumentDirectoryXSM" : "FALSE"
        },

        "doc_object xrx_document": {
            "enum_docformat DocumentFormat" : settings.scanDocumentFormat.PDF,
            "integer ImagesPerDocument" : "0",
            "boolean RotateTIFFUsingTag" : "FALSE",
            "enum_compression CompressionsSupported" : "G4, FLATE, ARITHMETIC_ENCODED_JBIG2,HUFFMAN_ENCODED_JBIG2, FLATE_COMPRESSED_JPEG, MIXED, NEW_JPEG_TIFF_TTN2, OLD_JPEG_TIFF_V6",
            "enum_mixedtype MixedTypesSupported" : "MULTI_MASK_MRC",
            "enum_mixedcompressions MixedCompressionsSupported" : "G4, ARITHMETIC_ENCODED_JBIG2,HUFFMAN_ENCODED_JBIG2, JPEG, FLATE_COMPRESSED_JPEG",
            "enum_optimizedforfastwebview OptimizedForFastWebView" : "NONE",
            "enum_halftonemethod HalftoneMethod" : "ERRORDIFFUSE",
            "enum_halftonescreen HalftoneScreen" : "AUTO",
            "enum_resolution Resolution" : settings.scanResolution["200dpi"],
            "enum_searchabletext SearchableText" : "IMAGE_ONLY",
            "enum_textcompression TextCompression" : "FLATE",
            "string DocumentObjectName": "DOC"
        }
        
    };




    var container = {
        data: baseTemplate,
        name: "",
        defaults: angular.copy(baseTemplate)
    };

    return container;
});
