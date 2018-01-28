define("ace/mode/people_code_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var PeopleCodeHighlightRules = function() {

    this.$rules = {
        start: [{
            include: "#code"
        }],
        "#classes": [{
            token: "meta.method.pcode",
            regex: /(?=class\s+[\w]+$)/,
            caseInsensitive: true,
            push: [{
                token: "meta.method.pcode",
                regex: /(?=end-class;)/,
                caseInsensitive: true,
                next: "pop"
            }, {
                token: [
                    "storage.modifier.pcode",
                    "meta.method.identifier.pcode",
                    "entity.name.function.pcode"
                ],
                regex: /(class)(\s+)([\w]+)$/,
                caseInsensitive: true,
                push: [{
                    token: "meta.method.identifier.pcode",
                    regex: /(?=end-class)/,
                    caseInsensitive: true,
                    next: "pop"
                }, {
                    include: "#code"
                }, {
                    defaultToken: "meta.method.identifier.pcode"
                }]
            }, {
                defaultToken: "meta.method.pcode"
            }]
        }],
        "#code": [{
            include: "#classes"
        }, {
            include: "#comments"
        }, {
            include: "#methods"
        }, {
            include: "#functions"
        }, {
            include: "#events"
        }, {
            include: "#parameters"
        }, {
            include: "#assertions"
        }, {
            include: "#constants-and-special-vars"
        }, {
            include: "#keywords"
        }, {
            include: "#storage-modifiers"
        }, {
            include: "#strings"
        }, {
            include: "#all-types"
        }],
        "#comments": [{
            token: "punctuation.definition.comment.pcode",
            regex: /\/\*\*\//
        }, {
            include: "text.html.pcodedoc"
        }, {
            include: "#comments-inline"
        }, {
            include: "#comments-methods"
        }, {
            include: "#comments-enclosing"
        }, {
            include: "#comments-rem"
        }],
        "#comments-enclosing": [{
            token: "punctuation.definition.comment.pcode",
            regex: /<\*/,
            push: [{
                token: "punctuation.definition.comment.pcode",
                regex: /\*>/,
                next: "pop"
            }, {
                defaultToken: "comment.block.pcode"
            }]
        }],
        "#comments-inline": [{
            token: "punctuation.definition.comment.pcode",
            regex: /\/\*/,
            push: [{
                token: "punctuation.definition.comment.pcode",
                regex: /\*\//,
                next: "pop"
            }, {
                defaultToken: "comment.block.pcode"
            }]
        }],
        "#comments-methods": [{
            token: "punctuation.definition.comment.pcode",
            regex: /\/\+/,
            push: [{
                token: "punctuation.definition.comment.pcode",
                regex: /\+\//,
                next: "pop"
            }, {
                defaultToken: "comment.block.pcode"
            }]
        }],
        "#comments-rem": [{
            token: "comment.block.pcode",
            regex: /\s*\b<!&[rR][eE][mM]\b.*$/,
            comment: "comment out single line REM statements"
        }],
        "#constants-and-special-vars": [{
            token: "constant.language.pcode",
            regex: /\b(?:true|false|null)\b/,
            caseInsensitive: true
        }, {
            token: "variable.language.pcode",
            regex: /\b(?:%This|%Super)\b/,
            caseInsensitive: true
        }],
        "#events": [{
            token: "entity.name.function.pcode",
            regex: /^\[[^\]]+\]$/,
            comment: "Also capture event PeopleCode - using Find In - Save PeopleCode to File"
        }],
        "#functions": [{
            token: "meta.Function.pcode",
            regex: /(?=Function\s+[\w]+\(.*\).*)/,
            caseInsensitive: true,
            push: [{
                token: "meta.Function.pcode",
                regex: /(?=End-Function;)/,
                caseInsensitive: true,
                next: "pop"
            }, {
                token: [
                    "storage.modifier.pcode",
                    "meta.Function.identifier.pcode",
                    "entity.name.function.pcode",
                    "meta.Function.identifier.pcode",
                    "meta.Function.identifier.pcode"
                ],
                regex: /(Function)(\s+)([\w]+)(\(.*\))(.*)/,
                caseInsensitive: true,
                push: [{
                    token: "meta.Function.identifier.pcode",
                    regex: /(?=End-Function)/,
                    caseInsensitive: true,
                    next: "pop"
                }, {
                    include: "#code"
                }, {
                    defaultToken: "meta.Function.identifier.pcode"
                }]
            }, {
                defaultToken: "meta.Function.pcode"
            }]
        }],
        "#keywords": [{
            token: "keyword",
            regex: /\b(?:SetSaveWarningFilter|array|of|And|out|ApiObject|boolean|datetime|Break|Returns|catch|CompIntfc|ComponentLife|Component|Constant|Declare|Else|Error|Exit|extends|implements|False|Field|File|Global|import|Integer|private|end-class|end-set|end-get|Item|Local|Null|number|Or|As|date|Row|Record|Repeat|Return|Rowset|Step|Scroll|string|property|instance|Then|Throw|To|True|Warning|When|Abs|AccruableDays|AccrualFactor|Acos|ActiveRowCount|AddAttachment|AddEmailAddress|AddKeyListItem|AddSystemPauseTimes|AddToDate|AddToDateTime|AddToTime|All|AllOrNone|AllowEmplIdChg|Amortize|Asin|Atan|BlackScholesCall|BlackScholesPut|BootstrapYTMs|BPurgeDomainStatus|BulkDeleteField|BulkInsertField|BulkModifyPageFieldOrder|BulkUpdateIndexes|CallAppEngine|CancelPubHeaderXmlDoc|CancelPubXmlDoc|CancelSubXmlDoc|ChangeEmailAddress|Char|CharType|CheckMenuItem|Clean|ClearKeyList|ClearSearchDefault|ClearSearchEdit|Panel|PanelGroup|Code|CollectGarbage|CommitWork|CompareLikeFields|ComponentChanged|ConnectorRequest|ConnectorRequestURL|ContainsCharType|ContainsOnlyCharType|ConvertChar|ConvertCurrency|ConvertDatetimeToBase|ConvertRate|ConvertTimeToBase|CopyAttachments|CopyFields|CopyFromJavaArray|CopyRow|CopyToJavaArray|Cos|Cot|Count|create|CreateAnalyticInstance|CreateArray|CreateArrayAny|CreateArrayRept|CreateDirectory|CreateException|CreateJavaArray|CreateJavaObject|CreateMCFIMInfo|CreateMessage|CreateObject|CreateObjectArray|CreateProcessRequest|CreateRecord|CreateRowset|CreateRowsetCache|CreateSOAPDoc|CreateSQL|CreateWSDLMessage|CreateXmlDoc|CubicSpline|CurrEffDt|CurrEffRowNum|CurrEffSeq|CurrentLevelNumber|AddStyleSheet|CurrentRowNumber|Date|Date3|DatePart|DateTime6|DateTimeToHTTP|DateTimeToLocalizedString|DateTimeToTimeZone|DateTimeValue|DateValue|Day|Days|Days360|Days365|DBCSTrim|DBPatternMatch|Decrypt|Degrees|DeleteAttachment|DeleteEmailAddress|DeleteImage|DeleteItem|DeleteRecord|DeleteRow|DeleteSQL|DeleteSystemPauseTimes|DeQueue|DetachAttachment|DisableMenuItem|DiscardRow|DoCancel|DoModal|DoModalX|DoModalComponent|DoModalXComponent|DoSave|DoSaveNow|EnableMenuItem|EncodeURL|EncodeURLForQueryString|Encrypt|EncryptNodePswd|EndMessage|EndModal|EndModalComponent|EnQueue|EscapeHTML|EscapeJavascriptString|EscapeWML|Exact|Exec|ExecuteRolePeopleCode|ExecuteRoleQuery|ExecuteRoleWorkflowQuery|Exp|ExpandBindVar|ExpandEnvVar|ExpandSqlBinds|Fact|FetchSQL|FetchValue|FieldChanged|FileExists|Find|FindCodeSetValues|FindFiles|FlushBulkInserts|FormatDateTime|Forward|GenerateActGuideContentUrl|GenerateActGuidePortalUrl|GenerateActGuideRelativeUrl|GenerateComponentContentRelURL|GenerateComponentContentURL|GenerateComponentPortalRelURL|GenerateComponentPortalURL|GenerateComponentRelativeURL|GenerateExternalPortalURL|GenerateExternalRelativeURL|GenerateHomepagePortalURL|GenerateHomepageRelativeURL|GenerateMobileTree|GenerateQueryContentURL|GenerateQueryPortalURL|GenerateQueryRelativeURL|GenerateScriptContentRelURL|GenerateScriptContentURL|GenerateScriptPortalRelURL|GenerateScriptPortalURL|GenerateScriptRelativeURL|GenerateTree|GenerateWorklistPortalURL|GenerateWorklistRelativeURL|get|GetAESection|GetAnalyticGridCreateObject|GetAnalyticInstance|GetArchPubHeaderXmlDoc|GetArchPubXmlDoc|GetArchSubXmlDoc|GetAttachment|GetBiDoc|GetCalendarDate|GetChart|GetChartURL|GetCwd|GetEnv|GetField|GetFile|GetGrid|GetHTMLText|GetImageExtents|GetInterlink|GetJavaClass|GetLevel0|GetMessage|GetMessageInstance|GetMessageXmlDoc|GetMethodNames|GetNextNumber|GetNextNumberWithGaps|GetNextNumberWithGapsCommit|GetNextProcessInstance|GetNRXmlDoc|GetPage|GetProgramFunctionInfo|GetPubContractInstance|GetPubHeaderXmlDoc|GetPubXmlDoc|GetRecord|GetRelField|GetRow|GetRowset|GetRowsetCache|GetSession|GetSetId|GetSQL|GetStoredFormat|GetSubContractInstance|GetSubXmlDoc|GetSyncLogData|GetURL|GetUserOption|GetWLFieldValue|Gray|UnGray|Hash|HermiteCubic|Hide|UnHide|HideMenuItem|HideRow|HideScroll|HistVolatility|Hour|IBPurgeNodesDown|Idiv|InboundPublishXmlDoc|InitChat|InsertImage|InsertItem|InsertRow|Int|IsAlpha|IsAlphaNumeric|IsDate|IsDateTime|IsDaylightSavings|IsDigits|IsDisconnectedClient|IsHidden|IsMenuItemAuthorized|IsMessageActive|IsModal|IsModalComponent|IsNumber|IsSearchDialog|IsTime|IsUserInPermissionList|IsUserInRole|IsUserNumber|Left|Len|LinearInterp|Ln|Log10|LogObjectUse|Lower|LTrim|MarkPrimaryEmailAddress|MarkWLItemWorked|Max|MCFBroadcast|MessageBox|Min|Minute|Mod|Month|MSFGetNextNumber|MsgGet|MsgGetExplainText|MsgGetText|NextEffDt|NextRelEffDt|NodeDelete|NodeRename|NodeSaveAs|NodeTranDelete|None|NotifyQ|Not|NumberToDisplayString|NumberToString|ObjectDoMethod|ObjectDoMethodArray|ObjectGetProperty|ObjectSetProperty|OnlyOne|OnlyOneOrNone|PingNode|PriorEffDt|PriorRelEffDt|PriorValue|Product|Proper|PublishXmlDoc|PutAttachment|Quote|Radians|Rand|RecordChanged|RecordDeleted|RecordNew|RelNodeTranDelete|RemoteCall|RemoveDirectory|RenameDBField|RenamePage|RenameRecord|Replace|Rept|ReSubmitPubHeaderXmlDoc|ReSubmitPubXmlDoc|ReSubmitSubXmlDoc|ReturnToServer|ReValidateNRXmlDoc|RevalidatePassword|Right|Round|RoundCurrency|RowCount|RowFlush|RowScrollSelect|RowScrollSelectNew|RTrim|ScrollFlush|ScrollSelect|ScrollSelectNew|Second|SendMail|SetAuthenticationResult|SetChannelStatus|SetComponentChanged|SetCursorPos|SetDBFieldAuxFlag|SetDBFieldCharDefn|SetDBFieldFormat|SetDBFieldFormatLength|SetDBFieldLabel|SetDBFieldLength|SetDBFieldNotUsed|SetDefault|SetDefaultAll|SetDefaultNext|SetDefaultNextRel|SetDefaultPrior|SetDefaultPriorRel|SetDisplayFormat|SetLabel|SetLanguage|SetMessageStatus|SetNextPage|SetPageFieldPageFieldName|SetPasswordExpired|SetPostReport|SetRecFieldEditTable|SetRecFieldKey|SetReEdit|SetSearchDefault|SetSearchDialogBehavior|SetSearchEdit|SetTempTableInstance|SetTracePC|SetTraceSQL|SetupScheduleDefnItem|SetUserOption|Sign|Sin|SinglePaymentPV|SortScroll|Split|SQLExec|Sqrt|StartWork|StopFetching|StoreSQL|StyleSheet|Substitute|Substring|String|SwitchUser|SyncRequestXmlDoc|Tan|Time|Time3|TimePart|TimeToTimeZone|TimeValue|TimeZoneOffset|TotalRowCount|Transfer|TransferExact|TransferMobilePage|TransferModeless|TransferNode|TransferPage|TransferPanel|TransferPortal|Transform|TransformEx|TransformExCache|TreeDetailInNode|TriggerBusinessEvent|Truncate|UnCheckMenuItem|Unencode|get|set|Ungray|Unhide|UnhideRow|UnhideScroll|UniformSeriesPV|UpdateSysVersion|UpdateValue|UpdateXmlDoc|Upper|Value|ValueUser|ViewAttachment|ViewContentURL|ViewURL|Weekday|WinEscape|WinExec|WinMessage|WriteToLog|Year|class|End-Class|end-evaluate|End-Evaluate|End-For|End-Function|End-If|method|end-method|end-try|End-While|evaluate|Evaluate|For|Function|If|try|while|XmlNode|SQL)\b/,
            caseInsensitive: true
        }, {
            token: "keyword",
            regex: /%(?:Attachment_Success|Attachment_Failed|Action_Add|Action_Correction|Action_UpdateDisplayAll|Action_UpdateDisplay|ApplicationLogFence_Error|ApplicationLogFence_Level1|ApplicationLogFence_Level2|EffDtCheck|ApplicationLogFence_Level3|ApplicationLogFence_Warning|AsOfDate|AuthenticationToken|BPName|ClientDate|ClientTimeZone|CompIntfcName|Component|ContentID|ContentType|Copyright|Currency|Date|DateTime|DbName|DbServerName|DbType|DeviceType|EmailAddress|EmployeeId|ExternalAuthInfo|Exec_Synchronous|FilePath_Absolute|FilePath_Relative|FilePath|HPTabName|Import|IntBroker|IsMultiLanguageEnabled|Language_Base|Language_Data|Language_Data|Language_Use|Language|LocalNode|Market|MaxInterlinkSize|MaxMessageSize|Menu|MobilePage|Mode|MsgResult_OK|NavigatorHomePermissionList|Node|OperatorClass|OperatorId|OperatorRowLevelSecurityClass|OutDestFormat|OutDestType|Page|PanelGroup|Panel|PasswordExpired|PerfTime|PermissionLists|PID|Portal|PrimaryPermissionList|ProcessProfilePermissionList|PSAuthResult|ExtAuthResult|Request|Response|ResultDocument|Roles|RowSecurityPermissionList|RunningInPortal|ServerTimeZone|Session|SignonUserId|SignOnUserPswd|SMTPBlackberryReplyTo|SMTPGuaranteed|SMTPSender|SQLRows|SyncServer|This|ThisMobileObject|Time|TransformData|UserDescription|UserId|WLInstanceID|WLName|Super)\b/,
            caseInsensitive: true
        }, {
            token: "keyword.control.catch-exception.pcode",
            regex: /\b(?:try|end-try|catch|finally|throw)\b/,
            caseInsensitive: true
        }, {
            token: "keyword.control.pcode",
            regex: /\?|:/
        }, {
            token: "keyword.control.pcode",
            regex: /\b(?:return|break|case|continue|default|Do|While|For|Evaluate|If|Else)\b/,
            caseInsensitive: true
        }, {
            token: "keyword.operator.pcode",
            regex: /\binstanceof\b/,
            caseInsensitive: true
        }, {
            token: "keyword.operator.comparison.pcode",
            regex: /=|!=|<=|>=|<>|<|>/
        }, {
            token: "keyword.operator.assignment.pcode",
            regex: /=/
        }, {
            token: "keyword.operator.arithmetic.pcode",
            regex: /\-|\+|\*|\/|%/
        }, {
            token: "keyword.operator.logical.pcode",
            regex: /!|&&|\|\|/
        }, {
            token: "keyword.operator.dereference.pcode",
            regex: /<=\S\.(?=\S)/
        }, {
            token: "punctuation.terminator.pcode",
            regex: /;/
        }],
        "#methods": [{
            token: "meta.method.pcode",
            regex: /(?=method\s+[\w]+$)/,
            caseInsensitive: true,
            push: [{
                token: "meta.method.pcode",
                regex: /(?=end-method;)/,
                caseInsensitive: true,
                next: "pop"
            }, {
                token: [
                    "storage.modifier.pcode",
                    "meta.method.identifier.pcode",
                    "entity.name.function.pcode"
                ],
                regex: /(method)(\s+)([\w]+)$/,
                caseInsensitive: true,
                push: [{
                    token: "meta.method.identifier.pcode",
                    regex: /(?=end-method)/,
                    caseInsensitive: true,
                    next: "pop"
                }, {
                    include: "#code"
                }, {
                    defaultToken: "meta.method.identifier.pcode"
                }]
            }, {
                defaultToken: "meta.method.pcode"
            }]
        }],
        "#object-types": [{
            token: "storage.type.object.array.pcode",
            regex: /\b(?:[a-z]\w*\.)*[A-Z]+\w*(?=\[)/,
            push: [{
                token: "storage.type.object.array.pcode",
                regex: /(?=[^\]\s])/,
                next: "pop"
            }, {
                token: "text",
                regex: /\[/,
                push: [{
                    token: "text",
                    regex: /\]/,
                    next: "pop"
                }, {
                    include: "#code"
                }]
            }, {
                defaultToken: "storage.type.object.array.pcode"
            }]
        }, {
            token: [
                "storage.type.pcode",
                "keyword.operator.dereference.pcode",
                "storage.type.pcode"
            ],
            regex: /\b(?:([a-z]\w*)(\.))*([A-Z]+\w*\b)/
        }],
        "#parameters": [{
            token: "variable.parameter.pcode",
            regex: /&\w+/
        }],
        "#primitive-arrays": [{
            token: "storage.type.primitive.array.pcode",
            regex: /\b(?:boolean|number|string)(?:\[\])*\b/,
            caseInsensitive: true
        }],
        "#primitive-types": [{
            token: "storage.type.primitive.pcode",
            regex: /\b(?:boolean|number|string|Record|Field|Rowset)\b/,
            caseInsensitive: true
        }],
        "#storage-modifiers": [{
            token: "storage.modifier.pcode",
            regex: /\b(?:public|private|protected|abstract)\b/,
            caseInsensitive: true
        }],
        "#strings": [{
            token: "punctuation.definition.string.begin.pcode",
            regex: /"/,
            push: [{
                token: "punctuation.definition.string.end.pcode",
                regex: /"/,
                next: "pop"
            }, {
                defaultToken: "string.quoted.double.pcode"
            }]
        }, {
            token: "punctuation.definition.string.begin.pcode",
            regex: /'/,
            push: [{
                token: "punctuation.definition.string.end.pcode",
                regex: /'/,
                next: "pop"
            }, {
                defaultToken: "string.quoted.single.pcode"
            }]
        }],
        "#values": [{
            include: "#strings"
        }, {
            include: "#object-types"
        }, {
            include: "#constants-and-special-vars"
        }]
    }
    
    this.normalizeRules();
};

PeopleCodeHighlightRules.metaData = {
    fileTypes: ["ppl", "pcode"],
    name: "PeopleCode",
    scopeName: "source.peoplecode"
}


oop.inherits(PeopleCodeHighlightRules, TextHighlightRules);

exports.PeopleCodeHighlightRules = PeopleCodeHighlightRules;
});

define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;

var FoldMode = exports.FoldMode = function(commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(
            this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
        );
        this.foldingStopMarker = new RegExp(
            this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
        );
    }
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {
    
    this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
    this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    this._getFoldWidgetBase = this.getFoldWidget;
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
    
        if (this.singleLineBlockCommentRe.test(line)) {
            if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                return "";
        }
    
        var fw = this._getFoldWidgetBase(session, foldStyle, row);
    
        if (!fw && this.startRegionRe.test(line))
            return "start"; // lineCommentRegionStart
    
        return fw;
    };

    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        
        if (this.startRegionRe.test(line))
            return this.getCommentRegionBlock(session, line, row);
        
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;

            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);
                
            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
            
            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                } else if (foldStyle != "all")
                    range = null;
            }
            
            return range;
        }

        if (foldStyle === "markbegin")
            return;

        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;

            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i, -1);
        }
    };
    
    this.getSectionRange = function(session, row) {
        var line = session.getLine(row);
        var startIndent = line.search(/\S/);
        var startRow = row;
        var startColumn = line.length;
        row = row + 1;
        var endRow = row;
        var maxRow = session.getLength();
        while (++row < maxRow) {
            line = session.getLine(row);
            var indent = line.search(/\S/);
            if (indent === -1)
                continue;
            if  (startIndent > indent)
                break;
            var subRange = this.getFoldWidgetRange(session, "all", row);
            
            if (subRange) {
                if (subRange.start.row <= startRow) {
                    break;
                } else if (subRange.isMultiLine()) {
                    row = subRange.end.row;
                } else if (startIndent == indent) {
                    break;
                }
            }
            endRow = row;
        }
        
        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    this.getCommentRegionBlock = function(session, line, row) {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;
        
        var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
        var depth = 1;
        while (++row < maxRow) {
            line = session.getLine(row);
            var m = re.exec(line);
            if (!m) continue;
            if (m[1]) depth--;
            else depth++;

            if (!depth) break;
        }

        var endRow = row;
        if (endRow > startRow) {
            return new Range(startRow, startColumn, endRow, line.length);
        }
    };

}).call(FoldMode.prototype);

});

define("ace/mode/people_code",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/people_code_highlight_rules","ace/mode/folding/cstyle"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var PeopleCodeHighlightRules = require("./people_code_highlight_rules").PeopleCodeHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = PeopleCodeHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.$id = "ace/mode/people_code"
}).call(Mode.prototype);

exports.Mode = Mode;
});
