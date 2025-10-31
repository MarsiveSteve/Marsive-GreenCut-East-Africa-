<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:output method="html" encoding="UTF-8"/>

  <!-- Page Title Mapping -->
  <xsl:variable name="titleMap">
    <map>
      <entry url="https://marsivesteve.github.io/Marsive-GreenCut-East-Africa-/" title="Home"/>
      <entry url="https://marsivesteve.github.io/Marsive-GreenCut-East-Africa-/services.html" title="Services"/>
      <entry url="https://marsivesteve.github.io/Marsive-GreenCut-East-Africa-/about.html" title="About Us"/>
      <entry url="https://marsivesteve.github.io/Marsive-GreenCut-East-Africa-/terms.html" title="Terms & Conditions"/>
    </map>
  </xsl:variable>

  <xsl:variable name="count" select="count(/s:urlset/s:url)"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>Marsive GreenCut East Africa – Sitemap</title>
        <style>
          body {font-family: Arial, sans-serif; padding: 25px; background: #fafaf5; color: #222;}
          h1 {text-align: center; margin-bottom: 5px; color: #1FA446; font-size: 28px;}
          .count {text-align: center; margin-bottom: 25px; font-size: 15px; opacity: 0.8;}
          .container {max-width: 900px; margin: auto; display: flex; flex-direction: column; gap: 15px;}
          .card {background: white; border: 2px solid #e5f5ea; border-radius: 12px; padding: 16px 20px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08); transition: 0.15s ease;}
          .card:hover {transform: translateY(-2px); box-shadow: 0 5px 14px rgba(0,0,0,0.12);}
          a {color: #1FA446; font-weight: 600; text-decoration: none; font-size: 17px;}
          .meta {margin-top: 6px; font-size: 14px; opacity: 0.75;}
        </style>
      </head>

      <body>
        <h1>Marsive GreenCut East Africa – Sitemap</h1>
        <div class="count">
          <xsl:value-of select="$count"/> Pages Indexed
        </div>

        <div class="container">
          <xsl:for-each select="s:urlset/s:url">
            <xsl:variable name="loc" select="s:loc"/>
            <div class="card">
              <div>
                <a href="{$loc}">
                  <xsl:choose>
                    <xsl:when test="$titleMap/map/entry[@url=$loc]">
                      <xsl:value-of select="$titleMap/map/entry[@url=$loc]/@title"/>
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:value-of select="$loc"/>
                    </xsl:otherwise>
                  </xsl:choose>
                </a>
              </div>
              <div class="meta">
                <xsl:if test="s:lastmod">Last Modified: <xsl:value-of select="s:lastmod"/></xsl:if>
              </div>
            </div>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>