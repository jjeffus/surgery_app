require 'nokogiri'
require "textmood"
require 'sentimental'
require 'textstat'
require 'word_count_analyzer'

class Project < ApplicationRecord
  has_many :updates
  after_create :add_statistics

  def self.by_amount
    self.where("amount is not null and category in ('mtf', 'ftm')")
  end

  def self.graph(column)
    min = self.by_amount.minimum(column)
    max = self.by_amount.maximum(column)
    total = self.by_amount.count
    spread = max - min
    steps = 8.0
    counts = []
    1.upto(steps).each do |num|
      step = (num / steps) * spread
      one = (1 / steps) * spread
      smax = min + step
      smin = smax - one
      cnt = self.by_amount.where("#{column} >= #{smin} and #{column} <= #{smax}").count
      counts.push [cnt / total.to_f,cnt,smin,smax]
    end
    counts
  end

  def self.new_from_gofundme(project)
    p = Project.where(:gofundme_key => project[:key]).first || Project.new
    updates = project[:updates]
    project[:gofundme_key] = project[:key]
    project[:gofundme_category] = project[:category]
    project.delete :updates
    project.delete :key
    project.delete :category
    project.delete :created_at
    project.delete :updated_at
    project.each_key do |key|
      p.send("#{key}=", project[key])
    end
    p.save!
    p.updates.delete_all
    updates.each do |update|
      Update.create do |u|
        u.update_text = update[1]
        u.update_html = update[2]
        u.project_id = p.id
      end
    end
    return p
  end

  def add_statistics
    tm = TextMood.new(language: "en")
    analyzer = Sentimental.new
    analyzer.load_defaults
    self.flesch_reading_ease = TextStat.flesch_reading_ease(self.story_text)
    self.dale_chall_readability_score = TextStat.dale_chall_readability_score(self.story_text)
    self.smog_index = TextStat.smog_index(self.story_text)
    self.difficult_words = TextStat.difficult_words(self.story_text)
    self.word_count = WordCountAnalyzer::Counter.new.mword_count(self.story_text)
    self.textmood_score = tm.analyze(self.story_text)
    self.sentimental_score = analyzer.score(self.story_text)
    self.sentiment = analyzer.sentiment(self.story_text).to_s
    self.save
  end
end
