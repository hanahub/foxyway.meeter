var xw = xw || {};
xw.templates = xw.templates || {};

xw.templates.settings = (function() {
    var settings = {
        scanRepo: {
            alias: "REPO_ALIAS",
            eipAlias: "EIP Studio",

            volume: "REPOSITORY_VOLUME",
            name: "REPOSITORY_NAME"
        },

        scanFiling: {
            protocol: "FILING_PROTOCOL",
            xrxHttp: "XRXHTTP",
            xrxHttps: "XRXHTTPS",
            ftp: "FTP",
            smb: "SMB"
        },

        loginSource: "LOGIN_SOURCE",

        scanDocumentPaht: "DOCUMENT_PATH",
        scanScript: "SCRIPT",
        scanUsername: "USERNAME",
        scanPassword: "PASSWORD",

        serverValidationReq: "SRVR_VALIDATION_REQD",

        scanJobTemplate: {
            description: "JOB_TEMPLATE_DESCRIPTION",
            name: "JOB_TEMPLATE_NAME",
            creator: "JOB_TEMPLATE_CREATOR"
        },

        scanSides: {
            sides: "SIDES_TO_SCAN",
            simplex: "ONE_SIDED",
            duplex: "TWO_SIDED",
            duplexRotated: "SECOND_SIDE_ROTATION"
        },

        inputMediaSize: "INPUT_MEDIA_SIZE",

        mediaSize: {
            auto : "AUTO",
            manual: "MANUAL",
            mixed: "MIXED",
            "5_5x7Portrait": "NA_5.5x7LEF",
            "5_5x7Landscape": "NA_5.5x7SEF",
            "5_5x8_5Portrait": "NA_5.5x8.5LEF",
            "5_5x8_5Landscape": "NA_5.5x8.5SEF",
            "8_5x11Portrait": "NA_8.5x11LEF",
            "8_5x11Landscape": "NA_8.5x11SEF",
            "8_5x13Landscape": "NA_8.5x13SEF",
            "8_5x14Landscape": "NA_8.5x14SEF",
            "11x17Landscape": "NA_11x17SEF",
            "A5Portrait": "ISO_A5LEF",
            "A5Landscape": "ISO_A5SEF",
            "A4Portrait": "ISO_A4LEF",
            "A4Landscape": "ISO_A4SEF",
            "A3Landscape": "ISO_A3SEF",
            "A3Portrait": "ISO_A3LEF",
            "JISB4Landscape": "JIS_B4SEF",
            "JISB5Portrait": "JIS_B5LEF",
            "JISB5Landscape": "JIS_B5SEF"
        },

        scanDocumentImageMode: {
            mode: "DOCUMENT_IMAGE_MODE",
            photoAndText: "MIXED",
            photo: "PHOTO",
            text: "TEXT",
            map: "MAP",
            newspaperAndMagazine: "NEWSPAPER_AND_MAGAZINE"
        },

        scanOriginalType: {
            type: "ORIGINAL_TYPE",
            printedOriginal: "PRINTED_ORIGINAL",
            photocopiedOriginalOriginal: "PHOTOCOPY"
        },

        scanOriginalOrientation: {
            orientation: "ORIGINAL_ORIENTATION",
            upright: "HEAD_TO_TOP",
            sideways: "HEAD_TO_FEED_EDGE",
            portrait: "PORTRAIT",
            landscape: "LANDSCAPE"
        },

        scanColorMode: {
            mode: "COLOR_MODE",
            auto: "AUTO",
            blackAndWhite: "BLACK_AND_WHITE",
            grayscale: "GRAYSCALE",
            color: "FULL_COLOR"
        },

        scanCompressionQuality: {
            quality: "COMPRESSION_QUALITY",
            normalSmall: "0",
            higherLarger: "128",
            highestLargest: "255"
        },

        scanDarkness: {
            darkness: "DARKNESS",
            zero: "0",
            plusOne: "33",
            plusTwo: "67",
            plusThree: "100",
            minusOne: "-33",
            minusTwo: "-67",
            minusThree: "-100"
        },

        scanSharpness: {
            sharpness: "SHARPNESS",
            zero: "0",
            plusOne: "50",
            plusTwo: "100",
            minusOne: "-50",
            minusTwo: "-100"
        },

        scanSaturation: {
            saturation: "SATURATION",
            zero: "0",
            plusOne: "50",
            plusTwo: "100",
            minusOne: "-50",
            minusTwo: "-100"
        },

        scanContrast: {
            contrast: "CONTRAST",
            zero: "0",
            plusOne: "50",
            plusTwo: "100",
            minusOne: "-50",
            minusTwo: "-100"
        },

        scanAutoContrast: {
            autoContrast: "AUTO_CONTRAST",
            on: "TRUE",
            off: "FALSE"
        },

        scanResolution: {
            scanResolution: "RESOLUTION",
            "72dpi": "RES_72X72",
            "100dpi": "RES_100X100",
            "150dpi": "RES_150X150",
            "200dpi": "RES_200X200",
            "300dpi": "RES_300X300",
            "400dpi": "RES_400X400",
            "600dpi": "RES_600X600"
        },

        scanBackgroundSuppression: {
            backgroundSuppression: "AUTO_EXPOSURE",
            on: "AUTO",
            off: "OFF"
        },

        scanMultiSegmentJob: {
            multiSegmentJob: "MULTI_SEGMENT_JOB",
            "true": "TRUE",
            "false": "FALSE"
        },

        scanFilename : "DOCUMENT_OBJECT_NAME",

        scanDocumentFormat: {
            documentFormat: "DOCUMENT_FORMAT",
            TIFF: "XSM_TIFF_V6",
            multiPageTIFF: "TIFF_V6",
            JPEG: "JFIF_JPEG",
            PDF: "PDF",
            PDF_A: "PDF/A-1b",
            XPS: "XPS"
        },

        scanSearchable: {
            searchable: "SEARCHABLE",
            imageOnly: "IMAGE_ONLY",
            searchableImage: "SEARCHABLE_IMAGE"
        },

        scanSearchLanguage: {
            searchLaguage: "SEARCH_LANGUAGE",
            en: "en"
        },

        scanEmail: {
            destination: "EMAIL_DESTINATION",
            subject: "EMAIL_SUBJECT",
            body: "EMAIL_BODY"
        },

        userMetaData: "XRX_METADATA",

        scanEdgeErase: {
            left: "EE_LEFT",
            top: "EE_TOP",
            right: "EE_RIGHT",
            bottom: "EE_BOTTOM"
        },

        blankPages: {
            include: 'INCLUDE_ALL_PAGES',
            exclude: 'OMIT_ALL_BLANK_PAGES'
        },

        filingPolicy : {
            overwrite: 'OVERWRITE',
            append: 'APPEND',
            newExact: 'NEW_EXACT', 
            auto: 'NEW_AUTO_GENERATE', 
            genDate: 'GEN_DATE_TIME_ID'
        }
    };

    return settings;
})();