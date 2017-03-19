<%--
Layout for a page.

$Id: tileLayout.jsp 10 2011-02-01 20:34:19Z scott $
$Log: tileLayout.jsp,v $
Revision 1.2  2007/07/24 20:48:55  aar1069
Add CVS stuff.


--%>

<%@page contentType="text/html; charset=windows-1252"%>
<%@ taglib uri="http://struts.apache.org/tags-html" prefix="html" %>
<%@ taglib uri="http://struts.apache.org/tags-bean" prefix="bean" %>
<%@ taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>
<%@ taglib uri="http://struts.apache.org/tags-tiles" prefix="tiles" %>

<html>
    <head>
        <title><tiles:getAsString name="title"/></title>
        <META HTTP-EQUIV="Cache-Control" CONTENT="max-age=0">
        <META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
        <meta http-equiv="expires" content="0">
        <META HTTP-EQUIV="Expires" CONTENT="Tue, 01 Jan 1980 1:00:00 GMT">
        <META HTTP-EQUIV="Pragma" CONTENT="no-cache">
        <link rel="stylesheet" type="text/css" media="all" href='<html:rewrite page="/QuoteOfTheDay.css" />'>
        <link rel="stylesheet" type="text/css" media="all" href='<html:rewrite page="/jquery/jquery-ui.css" />'>
        <link rel="stylesheet" type="text/css" media="all" href='<html:rewrite page="/jquery/jquery-ui.structure.css" />'>
        <link rel="stylesheet" type="text/css" media="all" href='<html:rewrite page="//jquery/jquery-ui.theme.css" />'>
    </head>

    <!-- jquery scripts -->
    <script type="text/javascript" src="<html:rewrite page='/jquery/jquery-2.1.3.js'/>"></script>
    <script type="text/javascript" src="<html:rewrite page='/jquery/jquery-ui.js'/>"></script>
    <script type="text/javascript" src="<html:rewrite page='/scripts/dialog.js'/>"></script>

    <script lang="javascript">
        $(function() {
            // initialize various entry types.
            // for date entry fields, use a datepicker and make the field read-only.
            $("input[class=dateEntry]")
                    .datepicker( { dateFormat: "yy-mm-dd" } )
                    .prop("readonly", true);
            
            // for submit buttons, use the jQuery-ui button.
            $("input[type=submit]").button();    
        });
    </script>
    <body>
        <div id="pageHeader" align="top"><tiles:insert attribute="header" /></div>

        <!-- Support for non-traditional but simple message -->
        <logic:present name="message">
            <b><font color="BLUE"><bean:write name="message" /></font></b>
        </logic:present>

        <!-- Support for non-traditional but simpler use of errors... -->
        <logic:messagesPresent>
            <h3>Errors</h3>
            <ul>
                <html:messages id="errors">
                    <li><b><font color="RED"><bean:write name="errors" /></font></b><br>
                </html:messages>
            </ul>
        </logic:messagesPresent>
        
        <!-- Main page body -->
        <div id="pageBody">
            <tiles:insert attribute='body' />
        </div>
        
        <!-- footer -->
        <div id="pageFooter">
            <tiles:insert attribute="footer" />
        </div>
    </body>
</html>