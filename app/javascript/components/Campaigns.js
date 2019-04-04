import React from "react"
import PropTypes from "prop-types"

String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return (this.length > n) ? this.substr(0, n-1) + '...' : this;
      };

function createMarkup(html) {
  return {__html: html};
}

function gotoPage(page, cursor) {
  var queryParameters = {}, queryString = location.search.substring(1),
  re = /([^&=]+)=([^&]*)/g, m;
  while (m = re.exec(queryString)) {
      queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  queryParameters['page'] = page;
  queryParameters['cursor'] = cursor;
  location.search = $.param(queryParameters);
}

class Campaigns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      pagination: {
        cursor: parseInt(props.cursor),
        page: parseInt(props.page)
      }
    };
  }

  previous(){
    var pagination = this.state.pagination;
    if (pagination.cursor > 0) {
      this.setState((prevState, props) => {
        var newState = JSON.parse(JSON.stringify(prevState));
        newState.pagination.cursor = parseInt(newState.pagination.cursor) - 1;
        return newState;
      });
    } else {
      if (pagination.page > 1) {
        pagination.page -= 1;
        pagination.cursor = parseInt(pagination.per_page) - 1;
        gotoPage(pagination.page, pagination.cursor);
      }
    }
  }

  next(){
    var pagination = this.state.pagination;
    if (pagination.cursor < (pagination.per_page - 1)) {
      this.setState((prevState, props) => {
        var newState = JSON.parse(JSON.stringify(prevState));
        newState.pagination.cursor = parseInt(newState.pagination.cursor) + 1;
        return newState;
      });
    } else {
      if (pagination.page <= pagination.pages) {
        pagination.page = parseInt(pagination.page) + 1;
        pagination.cursor = 0;
        gotoPage(pagination.page, pagination.cursor);
      }
    }
  }

  view(id) {
    console.log("Got", id);
  }

  close() {
    console.log("Close");
  }

  componentDidMount(){
    var page = this.state.pagination.page || parseInt(this.props.page);
    var cursor = this.state.pagination.cursor || parseInt(this.props.cursor);
    console.log("fetching", page, " with cursor ", cursor);
    fetch('/api/v1/projects/index/'+page+'.json')
      .then((response) => {return response.json()})
      .then((data) => {
        console.log("data", data);
        data.pagination.cursor = cursor;
        this.setState(data)
      });
  }

  componentDidUpdate(){
    console.log("componentDidUpdate()");
    var pagination = this.state.pagination;
    window.location.hash = parseInt(pagination.cursor);
    var project = this.state.projects[pagination.cursor];
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
  }

  render () {
    var obj = this;
    var state = this.state;
    var p = state.projects;
    var badges = [];
    var projects = [];
    var image = '';
    var mtf = '';
    var ftm = '';
    var deleted = '';
    var hearted = '';
    var profile = (<div id="profile"></div>);
    var listings = [];
    var project = {};
    var hasCursor = false;

    var prevPage = undefined;
    var nextPage = undefined;
    var pagination = this.state.pagination;
    var pages = [];
    if (pagination.pages > 1) {
      for (var i=1; i <= pagination.pages; i++) {
        console.log(i, "page + ", i);
        var active = "";
        if (i == parseInt(pagination.page)) {
          active = "active";
        }
        if (i == 1) {
          var page = (
            <li class={"page-item "+active}><a href={"/campaigns?page="+i} class="page-link">{i}</a></li>
          );
          pages.push(page);
          nextPage = 2
        } else if (i == pagination.pages) {
          prevPage = parseInt(pagination.pages) - 1;
        } else {
          nextPage = (i+1);
          prevPage = (i-1);
          var page = (
            <li class={"page-item "+active}><a href={"/campaigns?page="+i} class="page-link">{i}</a></li>
          );
          pages.push(page);
        }
      }
    }

    pages.unshift(
        <li class="page-item">
          <a href="#" class="page-link" aria-label="Previous">
            <span aria-hidden="true">
              <span class="lnr lnr-chevron-left"></span>
            </span>
          </a>
        </li>
    );
    pages.push(
      <li class="page-item">
        <a href="#" class="page-link" aria-label="Next">
          <span aria-hidden="true">
            <span class="lnr lnr-chevron-right"></span>
          </span>
        </a>
      </li>
    );

    var rows = [];
    var row = [];
    for (var j=1; j <= pages.length; j++) {
      if ((j % 12) == 0) {
        rows.push(row)
        row = [pages[j-1]];
      } else {
        row.push(pages[j-1]);
      }
    }
    rows.push(row);

    var parts = [];
    $.each(rows, function (i,e){
      var pag = (
        <ul class="pagination">
          {e}
        </ul>
      );
      parts.push(pag);
    });

    var pagination = (
      <div class="row">
        <nav class="blog-pagination justify-content-center">
          {parts}
        </nav>
      </div>
    );

    $.each(p, function(i,e){
      project = p[i];
      var image = (<div></div>);
      if (project.image) {
        image = (<a href={"https://www.gofundme.com/"+project.gofundme_key} target="_blank"><img alt="Project Image" class="img-fluid mx-auto d-block" src={project.image} /></a>)
      } else if (project.youtube) {
        image = (<iframe media_type="0" class="img-fluid mx-auto d-block" title="YouTube video player" src={project.youtube} frameborder="0" allowfullscreen="1"></iframe>);
      } else if (project.vimeo) {
        image = (<iframe media_type='2' class='img-fluid mx-auto d-block' src={project.vimeo} frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>);
      }

      if (i == state.pagination.cursor) {
        var hasCursor = true;
        var elements = [];
        var labels = {
          sentiment: ["One word sentiment based on the sentimental_score.", "https://github.com/7compass/sentimental"],
          sentimental_score: ["Simple sentiment analysis. If a sentence has a score of 0, it is deemed \"neutral\". Higher than the thresold is \"positive\", lower is \"negative\".", "https://github.com/7compass/sentimental"],
          textmood_score: ["TextMood is a simple and powerful sentiment analyzer. Negative numbers represent a negative sentiment, positive ones a positive one.", "https://github.com/stiang/textmood"],
          word_count: ["Count of words in the primary description.", ""],
          difficult_words: ["A simple count of difficult words.", "https://support.gofundme.com/hc/en-us/articles/115011597367-5-Tips-for-Writing-a-Captivating-Story"],
          flesch_reading_ease: ["The lower the score, the more difficult the text is to read. The Flesch readability score uses the average length of your sentences (measured by the number of words) and the average number of syllables per word in an equation to calculate the reading ease. Text with a very high Flesch reading ease score (about 100) is straightforward and easy to read, with short sentences and no words of more than two syllables. Usually, a reading ease score of 60-70 is considered acceptable/normal for web copy.<ul><li><b>100.00-90.00</b> 5th grade. Very easy to read. Easily understood by an average 11-year-old student.</li><li><b>90.0–80.0</b> 6th grade. Easy to read. Conversational English for consumers.</li><li><b>80.0–70.0</b> 7th grade. Fairly easy to read.</li><li><b>70.0–60.0</b> 8th & 9th grade. Plain English. Easily understood by 13-to 15-year-old people.</li><li><b>60.0–50.0</b> 10th to 12th grade. Fairly difficult to read.</li><li><b>50.0–30.0</b> College. Difficult to read.</li><li><b>30.0–0.0</b> 	College graduate 	Very difficult to read. Best understood by university graduates.</li></ul>", "https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests"],
          dale_chall_readability_score: ["The Dale–Chall readability formula is a readability test that provides a numeric gauge of the comprehension difficulty that readers come upon when reading a text.<ul><li><b>4.9</b> or lower is easily understood by 4th grade and lower.</li><li><b>5.0–5.9</b> easily understood by 5th or 6th-grader</li><li><b>6.0–6.9</b> easily understood by 7th or 8th-grader</li><li><b>7.0–7.9</b> easily understood by 9th or 10th grader</li><li><b>8.0–8.9</b> easily understood by 11th or 12th grader</li><li><b>9.0–9.9</b> easily understood by 13th to 15th (college) student</li></ul>", "https://en.wikipedia.org/wiki/Dale%E2%80%93Chall_readability_formula"],
          smog_index: ["The SMOG (Simplified Measure of Gobbledygoop) reading grade level test. This is a grade formula in that a score of 9.3 means that a ninth grader would be able to read the document. Requires a minimum of 3 sentences.", "https://en.wikipedia.org/wiki/SMOG"],
          link_count: ["A count of inks used in the introduction text.", undefined],
          updates_count: ["The number of updates made to the GoFundMe, regular updates ensure an active project.", "https://support.gofundme.com/hc/en-us/articles/204531958-Posting-Updates"]
        }
        project['textmood_score'] = parseFloat(project['textmood_score']).toFixed(2);
        project['sentimental_score'] = parseFloat(project['sentimental_score']).toFixed(2);
        $.each(labels, function(i,e){
          var label = i.replace(/(_|^)/g, ' ')
          label = label.replace(/\b\w/g, l => l.toUpperCase())
          elements.push(
            <li key={project['gofundme_key']+"_"+i}>
              <button type="button" class="btn btn-lg btn-light" data-toggle="popover" data-html="true"  data-trigger="focus" data-placement="bottom" data-content={labels[i][0] + (labels[i][1] ? " <a href=\""+labels[i][1]+"\" target=\"_blank\">Read more</a>" : "")}>{label+" "}<span class="badge">{project[i]}</span></button>
            </li>
          );
        });
        profile = (
        <section key={project.gofundme_key} class="condition-area event-details-area section-gap">
          <div class="container">
            <div class="row align-items-center justify-content-center">
              <div class="col-lg-6 col-md-8 col-sm-10">
                <div class="condition-left">
                  {image}
                </div>
              </div>
              <nav class="navbar navbar-expand-sm bg-light justify-content-center controls">
                <form class="form form-inline">
                  <button type="button" class="btn btn-info" onClick={() => obj.previous()} title="Previous Campaign">
                    <i class="fa fa-caret-left"></i>
                  </button>&nbsp;
                  <button type="button" class="btn btn-info" onClick={() => obj.next()} title="Next Campaign">
                    <i class="fa fa-caret-right"></i>
                  </button>&nbsp;
                  <button type="button" class="btn btn-danger" onClick={() => obj.close()} title="Close Detail View">
                    <i class="fa fa-window-close"></i>
                  </button>&nbsp;
                </form>
              </nav>
              <a href={"https://www.gofundme.com/"+project.gofundme_key} target="_blank">
                <h3><sub>View on </sub>
                <img src={image_path("gofundme_logo.png")} />
                </h3>
              </a>
              <div class="offset-lg-1 col-lg-5">
                <div class="condition-right">
                  <h2>{project.title}</h2>
                  <p>{project.story_text}</p>
                  <ul>
                    {elements}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        );
      } else { //  (i == state.pagination.cursor) {
        var percentage = ((p[i].amount / p[i].goal) * 100);
        var progressbar = "";
        var primarybtn = "";
        if (p[i].amount > p[i].goal) {
          primarybtn = "primary-btn3";
          progressbar = "progress-bar3";
        } else if (p[i].amount > p[i].goal * 0.80) {

        } else {
          primarybtn = "primary-btn1";
          progressbar = "progress-bar1";
        }
        var row = (
          <div class="col-lg-4 col-md-6" key={p[i].gofundme_key} click={() => obj.view(i)}>
            <div class="single-cause">
              <div class="top">
                <div class="thumb">
                  {image}
                </div>
                <a onClick={() => obj.view(i)}>
                  <h3>{p[i].title}</h3>
                </a>
                <p class="text">
                  {p[i].story_text.trunc(100)}
                </p>
              </div>
              <div class="bottom d-flex">
                <a onClick={() => obj.view(i)} class="primary-btn offwhite">View Details</a>
                <a href={"https://www.gofundme.com/"+project.gofundme_key} target="_blank" class={"primary-btn "+primarybtn}>Donate Here</a>
              </div>
              <div class="middle">
                <div class="skill_main">
                  <div class="skill_item">
                    <div class="progress">
                      <div class={"progress-bar "+progressbar} role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100" style={{width: percentage+"%"}}></div>
                    </div>
                  </div>
                </div>
                <div class="d-flex">
                  <div class="mr-50">
                    <h5><span class="counter">{percentage.toFixed(2)}</span>%</h5>
                    <p>Funded</p>
                  </div>
                  <div class="mr-50">
                    <h5>$<span class="counter">{p[i].amount}</span></h5>
                    <p>Raised</p>
                  </div>
                  <div class="">
                    <h5><span class="counter">{p[i].time}</span></h5>
                    <p>Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        listings.push(row);
      }
    });
    return (
<React.Fragment>
<section class="causes-area section-gap">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-md-7 section-title">
				<h2>Winning Campaigns</h2>
				<p>
					Here are active and previously successfull GoFundme campaigns.
				</p>
			</div>
		</div>
    {pagination}
		<div class="row">
			{listings}
		</div>
    {pagination}
	</div>
</section>
{profile}
</React.Fragment>);
  }

}

Campaigns.propTypes = {
  query: PropTypes.string,
  page: PropTypes.number,
  cursor: PropTypes.number
};
export default Campaigns
