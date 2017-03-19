<%--
Body of the index page.

$Id: indexBody.jsp 10 2011-02-01 20:34:19Z scott $
$Log: indexBody.jsp,v $
Revision 1.1  2007/07/24 20:56:48  aar1069
Initial version

--%>

<%@page contentType="text/html; charset=windows-1252"%>
<%@ taglib uri="http://struts.apache.org/tags-html" prefix="html" %>
<%@ taglib uri="http://struts.apache.org/tags-bean" prefix="bean" %>
<%@ taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>
<%@ taglib uri="http://struts.apache.org/tags-tiles" prefix="tiles" %>

<html:link page="/showQuoteOfTheDay.do">Get quote of the day</html:link><br>
<html:link page="/showQuote.do">Get specific quote</html:link><br>
<html:link page="/secure/defineNewQuote.do">Add new quote</html:link><br>
<html:link page="/showSourceCodeList.do">Quote source code list</html:link>
