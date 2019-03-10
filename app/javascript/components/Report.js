import React from "react"
import PropTypes from "prop-types"
class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  search() {
    console.log("image_path", image_path("loading.svg"));
    if ($('#url').val() == "") {
      return;
    }
    if (! $('#url').val().match(/gf.me\/u\/\w+|www.gofundme.com\/\w+/)) {
      return;
    }
    $('#profile').html('<div class="loading"><img src="'+image_path('loading.svg')+'" alt="Loading..." title="Loading..." />Loading...</div>')
    fetch('/api/v1/search/index.json?url='+escape($('#url').val()))
      .then((response) => {return response.json()})
      .then((data) => {
        console.log("data", data);
        this.setState(data)
      });
  }
  componentDidUpdate(){
    console.log("componentDidUpdate()");
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
  }
  componentDidMount(){
    this.search();
  }
  render () {
    console.log("rendering", this.state.project);
    console.log("props", this.props);
    var profile = (<div id="profile"></div>);
    var project = {};
    var suggestions = (<div></div>);
    if (this.state && this.state.project) {
      project = this.state.project;
      console.log("project", project);
      var image = (<div></div>);
      if (project.image) {
        image = (<img alt="Project Image" class="img-fluid mx-auto d-block" src={project.image} />)
      } else if (project.youtube) {
        image = (<iframe media_type="0" class="img-fluid mx-auto d-block" title="YouTube video player" src={project.youtube} frameborder="0" allowfullscreen="1"></iframe>);
      } else if (project.vimeo) {
        image = (<iframe media_type='2' class='img-fluid mx-auto d-block' src={project.vimeo} frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>);
      }
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
      project['textmood_score'] = project['textmood_score'].toFixed(2);
      project['sentimental_score'] = project['sentimental_score'].toFixed(2);
      $.each(labels, function(i,e){
        var label = i.replace(/(_|^)/g, ' ')
        label = label.replace(/\b\w/g, l => l.toUpperCase())
        elements.push(
          <li>
            <button type="button" class="btn btn-lg btn-light" data-toggle="popover" data-html="true"  data-trigger="focus" data-placement="bottom" data-content={labels[i][0] + (labels[i][1] ? " <a href=\""+labels[i][1]+"\" target=\"_blank\">Read more</a>" : "")}>{label+" "}<span class="badge">{project[i]}</span></button>
          </li>
        );
      });
      profile = (
      <section class="condition-area event-details-area section-gap">
        <div class="container">
          <div class="row align-items-center justify-content-center">
            <div class="col-lg-6 col-md-8 col-sm-10">
              <div class="condition-left">
                {image}
              </div>
            </div>
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
      suggestions = (
        <section class="causes-area section-gap">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-7 section-title">
                <h2>Congratulations!</h2>
                <p>You set up a GoFundMe! That's just the first step to seeing your surgical needs being met. You can do this! Below is a report on how your GoFundMe compares with winning GoFundMe transgender surgery campaigns.</p>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12 col-md-6">
                  <div class="single-cause">
                    <div id="content">
                      <div id="accordion">
                        <div class="card">
                          <div class="card-header" id="headingOne">
                            <h5 class="mb-0">
                              <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Word_count is less than 95% of winning campaigns.
                              </button>
                            </h5>
                          </div>

                          <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                            <div class="card-body">
                              Be sure to use enough words in your description to effectively communicate your story. We suggest between 200 and 500 words.
                            </div>
                          </div>
                        </div>
                        <div class="card">
                          <div class="card-header" id="headingTwo">
                            <h5 class="mb-0">
                              <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                flesch_reading_ease is higher than 90% of campaigns.
                              </button>
                            </h5>
                          </div>
                          <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                            <div class="card-body">
                              Consider rewriting your description using simpler words.
                            </div>
                          </div>
                        </div>
                        <div class="card">
                          <div class="card-header" id="headingThree">
                            <h5 class="mb-0">
                              <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                Amount is greater than $7,000.
                              </button>
                            </h5>
                          </div>
                          <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                            <div class="card-body">
                              Consider breaking your campaign up into multiple campaigns for separate surgeries. One thing at a time. Funding campaigns that are smaller are more likely to succeed.
                            </div>
                          </div>
                        </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </section>
      );
    }
    return (
      <React.Fragment><div>
<section class="home-banner-area relative">
  <div class="container-fluid">
    <div class="row d-flex align-items-center justify-content-center">
      <div class="header-left col-lg-5 col-md-6">
        <h1> Reach<br /> your goal!</h1>
        <p class="pt-20 pb-20"> Get the help you need with your GoFundMe campaign to reach your goal in record time. Enter your GoFundMe campaign in the form provided.</p>
      </div>
      <div class="col-lg-7 col-md-6 col-sm-8 header-right">
        <div class="owl-carousel owl-banner">
          <img class="img-fluid w-100" src={image_path('transgender-1.jpg')} />
        </div>
        <div class="form-wrap">
          <p class="mb-20 text-white">Enter Your GoFundMe Page</p>
            <form class="form" role="form" action="/tool" method="post">
              <div class="row">
                <div class="col-md-7 wrap-left donation-input">
                  <div class="form-group">
                    <input id="url" name="url" class="form-control" placeholder="https://www.gofundme.com/my-gofundme" type="text" defaultValue={this.props.url} />
                  </div>
                </div>
                <div class="col-md-5 wrap-right">
                  <div class="input-group dates-wrap">
                    <button class="primary-btn white" type="submit">Check</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</section>
{profile}
{suggestions}
</div></React.Fragment>);
  }
}

Report.propTypes = {
  url: PropTypes.string
};
export default Report
