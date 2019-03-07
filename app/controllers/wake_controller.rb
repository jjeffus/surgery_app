class WakeController < ApplicationController
  def now
    render :json => Time.now
  end
end
