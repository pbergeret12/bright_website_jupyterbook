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
tags: [remove-input]
---

# Alumni

<a href="team.html" class="view-all-button">Back to the team page</a>

## Former Interns

```{code-cell} python
:tags: [remove-input]

from IPython.display import display, HTML

former_interns = [
    {
        "name": "Seann Wang",
        "title": "Intern",
        "image": "seann_wang.jpeg",
        "dates": "Frebruary 2025 - June 2025",
        "links": {
            "LinkedIn": "https://www.linkedin.com/in/seann-wang-a72305179/",
            "GitHub": "https://github.com/wangseann"
        }
    },
    {
        "name": "Clara Maria Bridi",
        "title": "Intern",
        "image": "clara_maria.jpeg",
        "dates": "May 2025 - July 2025",
        "links": {
            "LinkedIn": "https://www.linkedin.com/in/clara-maria-bridi-ab7674271/"
        }
    }
]

html = """
<style>
.card {
  width: 220px;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid var(--pst-color-border);
  border-radius: 12px;
  padding: 1rem;
  background-color: var(--pst-color-surface);
  box-shadow: 2px 2px 6px rgba(0,0,0,0.08);
  text-align: center;
  font-family: sans-serif;
  font-size: 14px;
  color: var(--pst-color-text-base);
}

.card img {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 0.5rem;
}

.card small {
  color: var(--pst-color-text-muted);
  font-size: 12px;
}

.modal {
  display: none;
  position: fixed;
  z-index: 999;
  padding: 2rem;
  background-color: rgba(0,0,0,0.5);
  left: 0; top: 0;
  width: 100%; height: 100%;
}

.modal-content {
  background: var(--pst-color-surface);
  color: var(--pst-color-text-base);
  padding: 1rem;
  border-radius: 8px;
  max-width: 600px;
  margin: 5% auto;
  border: 1px solid var(--pst-color-border);
}

.modal-content h3 {
  margin-top: 0;
}

.modal-close {
  float: right;
  font-weight: bold;
  cursor: pointer;
}
</style>
<div style='display: flex; flex-wrap: wrap; gap: 1.5rem;'>
"""

for member in former_interns:
    links = "".join([f"<a href='{url}' target='_blank'>🔗 {name}</a><br/>" for name, url in member["links"].items()])
    image_path = f"_static/images/{member['image']}"
    html += f"""
    <div class="card">
        <img src="{image_path}" alt="{member['name']}"/>
        <strong>{member['name']}</strong><br/>
        <em>{member['title']}</em><br/>
        <small>{member['dates']}</small><br/><br/>
        {links}
    </div>
    """

html += "</div>"
display(HTML(html))
