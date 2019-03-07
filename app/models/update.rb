class Update < ApplicationRecord
  belongs_to :project
  after_create :add_statistics

  def add_statistics
    nok = Nokogiri::HTML(self.update_html)
    self.link_count = 0
    nok.xpath(".//a").each do |a|
      self.link_count += 1
    end
    tm = TextMood.new(language: "en")
    analyzer = Sentimental.new
    analyzer.load_defaults
    self.flesch_reading_ease = TextStat.flesch_reading_ease(self.update_text)
    self.dale_chall_readability_score = TextStat.dale_chall_readability_score(self.update_text)
    self.smog_index = TextStat.smog_index(self.update_text)
    self.difficult_words = TextStat.difficult_words(self.update_text)
    self.word_count = WordCountAnalyzer::Counter.new.mword_count(self.update_text)
    self.textmood_score = tm.analyze(self.update_text)
    self.sentimental_score = analyzer.score(self.update_text)
    self.sentiment = analyzer.sentiment(self.update_text).to_s
    self.save
  end
end
