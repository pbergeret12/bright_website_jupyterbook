# How to contribute and run the website locally
To contribute to the website:
1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Create a new branch for your changes.
4. Make your changes and commit them with clear messages.
5. Push your changes to your forked repository.
6. Open a pull request to the main repository.

To run the website locally:
`pip install -U jupyter-book`

Then navigate to the root directory of the repository and run:
`jupyter-book build .`

Then open the index.html file in the `_build/html` folder in your web browser.

For more info on jupyterbook: https://jupyterbook.org/en/stable/start/your-first-book.html

# How to modify a page?
- To add an image: add the file in the `_static/images/` folder
- To add a news on the News page: add content in the `_static/news_data.js` file (simply follow the existing format)
- To add a member on the Team page: add content in the `_static/js/team_data.js` file (simply follow the existing format)
- To edit the Home page: edit the `index.md` file

