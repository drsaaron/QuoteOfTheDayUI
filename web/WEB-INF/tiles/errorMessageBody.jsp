<%-- 
    Document   : errorMessageBody
    Created on : Dec 22, 2009, 10:43:33 AM
    Author     : aar1069
--%>

<%@ page import="java.io.PrintWriter"%>

<%@page contentType="text/html; charset=windows-1252"%>
<%@ taglib uri="http://struts.apache.org/tags-html" prefix="html" %>
<%@ taglib uri="http://struts.apache.org/tags-bean" prefix="bean" %>
<%@ taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>
<%@ taglib uri="http://struts.apache.org/tags-tiles" prefix="tiles" %>

<logic:notPresent name="BeanActionException">
  <logic:notPresent name="message">
    <H3>Something happened...</H3>
    <B>But no further information was provided.</B>
  </logic:notPresent>
</logic:notPresent>
<P/>
<logic:present name="BeanActionException">
  <H3>Error!</H3>
  <B><font color="red"><bean:write name="BeanActionException" property="class.name"/></font></B>
  <P/>
  <bean:write name="BeanActionException" property="message"/>
</logic:present>
<P/>
<logic:present name="BeanActionException">
  <h4>Stack</h4>
  <i><pre>
<%
  Exception e = (Exception)request.getAttribute("BeanActionException");
  e.printStackTrace(new PrintWriter(out));
%>
  </pre></i>
</logic:present>
