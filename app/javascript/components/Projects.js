import React from "react"
import PropTypes from "prop-types"

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

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      pagination: {
        cursor: props.cursor,
        page: props.page
      }
    };
  }

  componentDidMount(){
    var page = this.state.pagination.page || this.props.page;
    var cursor = this.state.pagination.cursor || this.props.cursor;
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
    var pagination = this.state.pagination;
    var star_rating = this.state.projects[pagination.cursor].star_rating;
    $.each($('input[name="rating"]'), function(i,e){
      if ($(e).attr('id') != 'star'+star_rating) {
        $(e).removeAttr('checked');
      } else {
        if (star_rating) {
          // BUG: This is re-sending the request every cursor change
          ///     At least the CSS is updating and I don't care for this
          //      personal project. Would not do this in a commercial one.
          $('#star'+star_rating).click();
        }
      }
    });
  }

  render () {
    var state = this.state;
    var p = state.projects;
    var projects = [];
    var image = '';
    var mtf = '';
    var ftm = '';
    var deleted = '';
    var hearted = '';
    $.each(p, function(i,e){
      if (i == state.pagination.cursor) {
        if (p[i].category) {
          if (p[i].category == 'mtf') {
            mtf = ' active';
          } else if (p[i].category == 'ftm') {
            ftm = ' active';
          } else if (p[i].category == 'deleted') {
            deleted = ' active';
          }
        }
        if (p[i].hearted == true) {
          hearted = ' active';
        }
        if (p[i].image) {
          image = (<img alt="" class="img-fluid mx-auto d-block" src={p[i].image} />)
        } else if (p[i].youtube) {
          image = (<iframe media_type="0" class="img-fluid mx-auto d-block" title="YouTube video player" src={p[i].youtube} frameborder="0" allowfullscreen="1"></iframe>);
        } else if (p[i].vimeo) {
          image = (<iframe media_type='2' class='img-fluid mx-auto d-block' src={p[i].vimeo} frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>);
        }
        projects.push(
          <section class="project" key={p[i].gofundme_key} id={"project"+i} data-id={p[i].id}>
            <div class="container">
              <p class="lead text-center" id="title">{p[i].title}</p>
              <p id="body" dangerouslySetInnerHTML={createMarkup(p[i].story_html)}></p>
            </div>
          </section>
        );
      }
    });
    return (
      <React.Fragment>
        <div class="img-fluid mx-auto d-block" id="image">
          {image}
        </div>
        <nav class="navbar navbar-expand-sm bg-light justify-content-center controls">
          <form class="form form-inline">
            <button type="button" class="btn btn-info" onClick={() => this.previous()}>
              <i class="fa fa-caret-left"></i>
            </button>
            <div class="btn-group btn-group-toggle" data-toggle="buttons">
              <label class={"btn btn-secondary"+ftm} onClick={() => this.categorize()}>
                <input type="radio" name="category" id="ftm" autocomplete="off" /> <i class="fa fa-male"></i>
              </label>
              <label class={"btn btn-secondary"+mtf} onClick={() => this.categorize()}>
                <input type="radio" name="category" id="mtf" autocomplete="off" /> <i class="fa fa-female"></i>
              </label>
              <label class={"btn btn-secondary"+deleted} onClick={() => this.categorize()}>
                <input type="radio" name="category" id="deleted" autocomplete="off" /> <i class="fa fa-trash"></i>
              </label>
            </div>
            <div class="btn-group-toggle" data-toggle="buttons">
              <label id="heart" class={"btn btn-dark"+hearted} onClick={() => this.heart()}>
                <input type="checkbox" autocomplete="off" /><i class="fa fa-heart"></i>
              </label>
            </div>
            <button type="button" class="btn btn-info" onClick={() => this.next()}>
              <i class="fa fa-caret-right"></i>
            </button>
          </form>
        </nav>
        <div class="container">
        	<div class="row justify-content-center">
        	  <div class="rating">
              <input type="radio" id="star10" name="rating" value="10"  onClick={() => this.star_rating(10)} /><label for="star10" title="Rocks!">5 stars</label>
              <input type="radio" id="star9" name="rating" value="9" onClick={() => this.star_rating(9)} /><label for="star9" title="Rocks!">4 stars</label>
              <input type="radio" id="star8" name="rating" value="8" onClick={() => this.star_rating(8)} /><label for="star8" title="Pretty good">3 stars</label>
              <input type="radio" id="star7" name="rating" value="7" onClick={() => this.star_rating(7)} /><label for="star7" title="Pretty good">2 stars</label>
              <input type="radio" id="star6" name="rating" value="6" onClick={() => this.star_rating(6)} /><label for="star6" title="Meh">1 star</label>
              <input type="radio" id="star5" name="rating" value="5" onClick={() => this.star_rating(5)} /><label for="star5" title="Meh">5 stars</label>
              <input type="radio" id="star4" name="rating" value="4" onClick={() => this.star_rating(4)} /><label for="star4" title="Kinda bad">4 stars</label>
              <input type="radio" id="star3" name="rating" value="3" onClick={() => this.star_rating(3)} /><label for="star3" title="Kinda bad">3 stars</label>
              <input type="radio" id="star2" name="rating" value="2" onClick={() => this.star_rating(2)} /><label for="star2" title="Sucks big tim">2 stars</label>
              <input type="radio" id="star1" name="rating" value="1" onClick={() => this.star_rating(1)} /><label for="star1" title="Sucks big time">1 star</label>
            </div>
        	</div>
        </div>
        {projects}
      </React.Fragment>
    );
  }

  star_rating(rating){
    console.log("star rating", rating);
    this.state.projects[this.state.pagination.cursor].star_rating = rating;
    var id = $('.project').attr('data-id');
    fetch(`/api/v1/projects/${id}.json`,
    {
      method: 'PUT',
      body: JSON.stringify({star_rating: rating}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
        console.log(response);
    });
  }

  categorize(){
    var id = $('.project').attr('data-id');
    var category = $($('.btn.btn-secondary.active')[0].children[0]).attr('id');
    console.log('category', category);
    fetch(`/api/v1/projects/${id}.json`,
    {
      method: 'PUT',
      body: JSON.stringify({category: category}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
        console.log(response);
    });
  }

  heart(){
    var id = $('.project').attr('data-id');
    fetch(`/api/v1/projects/${id}.json`,
    {
      method: 'PUT',
      body: JSON.stringify({hearted: $('#heart').attr('class').includes('active')}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
        console.log(response);
    });
  }

  previous(){
    var pagination = this.state.pagination;
    if (pagination.cursor > 0) {
      this.setState((prevState, props) => {
        var newState = JSON.parse(JSON.stringify(prevState));
        newState.pagination.cursor -= 1;
        return newState;
      });
    } else {
      if (pagination.page > 1) {
        pagination.page -= 1;
        pagination.cursor = pagination.per_page - 1;
        gotoPage(pagination.page, pagination.cursor);
      }
    }
  }

  next(){
    var pagination = this.state.pagination;
    if (pagination.cursor < (pagination.per_page - 1)) {
      this.setState((prevState, props) => {
        var newState = JSON.parse(JSON.stringify(prevState));
        newState.pagination.cursor += 1;
        return newState;
      });
    } else {
      if (pagination.page <= pagination.pages) {
        pagination.page += 1;
        pagination.cursor = 0;
        gotoPage(pagination.page, pagination.cursor);
      }
    }
  }
}

Projects.propTypes = {
  page: PropTypes.number
};
export default Projects
