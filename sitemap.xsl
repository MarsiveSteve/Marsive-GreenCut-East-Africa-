<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:output method="html" encoding="UTF-8"/>

  <!-- Count URLs -->
  <xsl:variable name="count" select="count(/s:urlset/s:url)"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>Marsive GreenCut East Africa – Sitemap</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 25px;
            background: #fafaf5;
            color: #222;
          }

          @media (prefers-color-scheme: dark) {
            body {
              background: #111;
              color: #f1f1f1;
            }
            .card {
              background: #1a1a1a;
              border-color: #1FA446;
            }
            a { color: #1FA446; }
            .back-btn {
              background: rgba(31,164,70,0.1);
              color: #1FA446;
              border: 1px solid #1FA446;
            }
          }

          h1 {
            text-align: center;
            margin-bottom: 5px;
            color: #1FA446;
            font-size: 28px;
          }

          .count {
            text-align: center;
            margin-bottom: 25px;
            font-size: 15px;
            opacity: 0.8;
          }

          .container {
            max-width: 900px;
            margin: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .card {
            background: white;
            border: 2px solid #e5f5ea;
            border-radius: 12px;
            padding: 16px 20px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }

          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 14px rgba(0,0,0,0.12);
          }

          a {
            color: #1FA446;
            font-weight: 600;
            text-decoration: none;
            font-size: 17px;
            word-break: break-all;
          }

          .meta {
            margin-top: 6px;
            font-size: 14px;
            opacity: 0.75;
          }

          .back-btn {
            display: inline-block;
            margin: 0 auto 20px auto;
            padding: 8px 16px;
            border-radius: 20px;
            background: #e8fff0;
            color: #1FA446;
            text-decoration: none;
            font-size: 14px;
            border: 1px solid #c2f0d3;
            transition: 0.2s ease;
          }

          .back-btn:hover {
            background: #d4f7e3;
          }

          .top {
            text-align: center;
            margin-bottom: 15px;
          }
        </style>
      </head>

      <body>
        <div class="top">
          <a class="back-btn" href="https://marsivesteve.github.io/Marsive-GreenCut-East-Africa-/">← Back to Website</a>
        </div>

        <h1>Marsive GreenCut East Africa – Sitemap</h1>
        <div class="count">
          <xsl:value-of select="$count"/> Pages Indexed
        </div>

        <div class="container">
          <xsl:for-each select="s:urlset/s:url">
            <div class="card">
              <div><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></div>
              <div class="meta">
                <xsl:if test="s:lastmod">Last Modified: <xsl:value-of select="s:lastmod"/> | </xsl:if>
                <xsl:if test="s:priority">Priority: <xsl:value-of select="s:priority"/></xsl:if>
              </div>
            </div>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>