---
jupytext:
  formats: ipynb,md
  text_representation:
    extension: .md
    format_name: myst
kernelspec:
  name: python3
  language: python
  display_name: Python 3
---

<script type="application/json" id="pub-data">
[
  {
    "image": "fc_relationships.jpeg",
    "title": "Brain functional connectivity mirrors genetic pleiotropy in psychiatric conditions",
    "year": "April 2023",
    "authors": "Clara A Moreau , Kuldeep Kumar , Annabelle Harvey , Guillaume Huguet , Sebastian G W Urchs , Laura M Schultz , Hanad Sharmarke , Khadije Jizi , Charles-Olivier Martin , Nadine Younis , Petra Tamer , Jean-Louis Martineau , Pierre Orban , Ana Isabel Silva , Jeremy Hall , Marianne B M van den Bree , Michael J Owen , David E J Linden , Sarah Lippé , Carrie E Bearden , Laura Almasy , David C Glahn , Paul M Thompson , Thomas Bourgeron , Pierre Bellec , Sebastien Jacquemont",
    "link": "https://doi.org/10.1093/brain/awac315"
  },
  {
    "image": "ml_disorders.webp",
    "title": "Machine Learning for Neurodevelopmental Disorders",
    "year": "July 2023",
    "authors": "Clara Moreau, Christine Deruelle & Guillaume Auzias",
    "link": "https://doi.org/10.1007/978-1-0716-3195-9"
  },
  {
    "image": "anorexia.webp",
    "title": "Neuroimaging Insights into Brain Mechanisms of Early-onset Restrictive Eating Disorders",
    "year": "November 2024",
    "authors": "Clara A Moreau, Anael Ayrolles, Christopher R K Ching, Robin Bonicel, Alexandre Mathieu, Coline Stordeur, Pierre Bergeret, Nicolas Traut, Lydie Tran, David Germanaud, Marianne Alison, Monique Elmaleh-Bergès, Stefan Ehrlich, Paul M Thompson, Thomas Bourgeron, Richard Delorme",
    "link": "https://doi.org/10.1101/2024.11.12.24317128"
  },
  {
    "image": "similarities.jpg",
    "title": "Genetic Heterogeneity Shapes Brain Connectivity in Psychiatry",
    "year": "January 2023",
    "authors": "Clara A. Moreau, Annabelle Harvey, Kuldeep Kumar, Guillaume Huguet, Sebastian G.W. Urchs, Elise A. Douard, Laura M. Schultz, Hanad Sharmarke, Khadije Jizi, Charles-Olivier Martin, Nadine Younis, Petra Tamer, Thomas Rolland, Jean-Louis Martineau, Pierre Orban, Ana Isabel Silva, Jeremy Hall, Marianne B.M. van den Bree, Michael J. Owen, David E.J. Linden, Sebastien Jacquemont",
    "link": "https://doi.org/10.1016/j.biopsych.2022.08.024"
  }
]
</script>

# Publications

## Main Publications


:::{raw} html
<!-- === STYLES === -->
<link rel="stylesheet" href="_static/custom_carousel.css">
<link rel="stylesheet" href="_static/publication_modal.css">

<!-- === CAROUSEL STRUCTURE === -->
<div class="publications-carousel-container">
  <div class="carousel-control prev">&#8592;</div>
  <div class="publications-carousel">
    <div class="publications-list"></div>
  </div>
  <div class="carousel-control next">&#8594;</div>
</div>

<!-- === MODAL STRUCTURE === -->
<div class="publication-modal">
  <div class="publication-modal-content">
    <span class="close-button">&times;</span>
    <h2 class="modal-pub-title"></h2>
    <p class="modal-pub-authors"></p>
    <p class="modal-pub-journal"></p>
    <p class="modal-pub-year"></p>
    <p class="modal-pub-doi"></p>
    <p class="modal-pub-link"></p>
    <div class="modal-pub-description">
      <p class="modal-pub-abstract"></p>
    </div>
  </div>
</div>

<!-- === JS === -->
<script src="_static/custom_carousel.js"></script>
<script src="_static/publication_modal.js"></script>
<script src="_static/publications_carousel.js"></script>
:::

---

## Other Publications from PubMed Feed

```{code-cell} python
:tags: [remove-input]

from IPython.display import display, Markdown, HTML
import feedparser
from dateutil import parser as dateparser
import re
import html

rss_url = "https://pubmed.ncbi.nlm.nih.gov/rss/search/1b_xvYg-6HN0FKdpXW1N__SKCt4EGO7EaY44wp81q6vp5tMsAO/?limit=20&utm_campaign=pubmed-2&fc=20250724150114"
feed = feedparser.parse(rss_url)

def format_authors(authors_list):
    if not authors_list:
        return "Unknown author"
    names = [author["name"] for author in authors_list]
    if len(names) > 10:
        return f"{names[0]} et al."
    return ", ".join(names)

def get_tag(authors_list, year):
    if not authors_list or not year:
        return "[UNKXX]"
    last = authors_list[0]["name"].split()[-1]
    return f"[{last[:3].upper()}{year[-2:] if year.isdigit() else 'XX'}]"

def extract_doi(entry):
    dc_id = entry.get("dc_identifier", "")
    if isinstance(dc_id, str) and dc_id.lower().startswith("doi:"):
        return dc_id[4:]
    content = entry.get("content", [])
    if content and "value" in content[0]:
        value = html.unescape(content[0]["value"])
        match = re.search(r'https?://doi\.org/(10\.\d{4,9}/[-._;()/:A-Z0-9]+)', value, re.IGNORECASE)
        if match:
            return match.group(1)
    return None

for entry in feed.entries:
    try:
        title = entry.title.strip()
        year = str(dateparser.parse(entry.get("published", "")).year)
        authors_list = entry.get("authors", [])
        authors = format_authors(authors_list)
        journal = entry.get("dc_source") or "Unknown journal"
        tag = get_tag(authors_list, year)
        doi = extract_doi(entry)

        link_line = f"🔗 [https://doi.org/{doi}](https://doi.org/{doi})" if doi else "🔗 DOI not found"

        display(HTML(
f"""
<div class="rss-publication">
<h4>{tag}</h4>
<p><strong>{authors}</strong><br>
{title}<br>
<em>{journal}</em>, {year}<br>
<a href="https://doi.org/{doi}" target="_blank">🔗 https://doi.org/{doi}</a></p>
</div>
"""
))
    except Exception as e:
        display(Markdown(f"⚠️ Error displaying entry: {e}"))
