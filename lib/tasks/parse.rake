#!/usr/bin/env ruby

require 'nokogiri'
require "textmood"
require 'sentimental'
require 'textstat'
require 'word_count_analyzer'

namespace :data do
  task :parse => :environment do
    desc "Parse all the pages into the database."
    tm = TextMood.new(language: "en")
    analyzer = Sentimental.new
    analyzer.load_defaults
    cnt = 0
    Dir["/home/janet/dev/surgeryresearch/pages/*"].to_a.each do |file|
      begin
        key = file.split("/").last
        puts "Working on: #{key}: #{cnt}"
        cnt += 1
        nok = Nokogiri::HTML(File.read(file))
        p = Project.new
        p.completed = false
        p.gofundme_key = key
        p.title = ''
        p.name = ''
        nok.xpath("//h1[@class='campaign-title']").each do |h1|
          p.title = h1.inner_text.strip
        end
        if p.title == ''
          nok.xpath("//h1[@class='campaign-title pb']").each do |h1|
            p.title = h1.inner_text.strip
          end
        end
        if p.title == nil
          puts "No title found! Exiting..."
          next
        end
        nok.xpath("//img[@class='campaign-img']").each do |tag|
          p.image = tag.attr('src')
        end
        nok.xpath("//iframe[@title='YouTube video player']").each do |iframe|
          p.youtube = iframe.attr('src')
        end
        nok.xpath("//iframe[@media_type='2']").each do |iframe|
          p.vimeo = iframe.attr('src')
        end
        p.images = p.image ? 1 : 0
        nok.xpath("//div[@id='js-open-media-viewer']").each do |div|
          if div.inner_text.strip =~ /(\d+)/
            p.images = $1
          end
        end
        p.shares = 0
        nok.xpath("//strong[@class='js-share-count-text']").each do |strong|
          if strong.inner_text.strip =~ /(\d+)/
            p.shares = $1.to_i
          end
        end
        p.amount = 0
        p.pounds = 0
        p.goal = 0
        p.goal_pounds = 0
        nok.xpath("//h2[@class='goal']|//h2[@class='goal mb0']").each do |h2|
          amount = 0
          h2.xpath("./strong").each do |h2|
            amount = h2.inner_text.strip
          end
          if amount =~ /^\$(.*)/
            p.amount = $1.gsub(/,/, '').to_f
          elsif amount =~ /^£(.*)/
            p.pounds = $1.gsub(/,/, '').to_f
            p.amount = p.pounds * 1.31
          end
          goal = 0
          h2.xpath("./span").each do |span|
            goal = span.inner_text.strip
          end
          if goal =~ /of \$((?:\d+|[,.])+)/
            p.goal = $1.gsub(/,/, '').to_f
          elsif goal =~ /of £((?:\d+|[,.])+)/
            p.goal_pounds = $1.gsub(/,/, '').to_f
            p.goal = p.goal_pounds * 1.31
          else
            # no donations yet
            if h2.attr('class') =~ /mb0/
              p.completed = true
              nok.xpath("//title").each do |title|
                if title.inner_text.strip =~ /Fundraiser by ([^:]+):/
                  p.name = $1.strip
                end
              end
            else
              p.goal = p.amount
              p.amount = nil
            end
          end
        end
        p.backers = 0
        p.days = 0
        p.time = ''
        nok.xpath("//div[@class='campaign-status text-small']").each do |div|
          if div.inner_text =~ /Campaign created /
            p.backers = 0
            if div.inner_text =~ /Campaign created (\d+ \w+)/
              p.time = $1
            end
          else
            p.backers = div.xpath("./span").first.inner_text.to_i
            if div.inner_text =~ /(?:people|person) in (\d+ \w+)/
              p.time = $1
            end
          end
        end
        p.trending = false
        nok.xpath("//div[@data-identifier='trending']").each do |div|
          p.trending = true
        end
        p.story_html = ''
        p.story_text = ''
        p.links = 0
        p.word_count = 0
        p.english = true
        nok.xpath("//div[@id='story']/div[3]").each do |div|
          p.story_html = div.inner_html.strip
          p.links = 0
          div.xpath(".//a").each do |a|
            p.links += 1
          end
          if p.story_text =~ /Translate story to English/
            p.english = false
          else
            p.story_text = div.inner_text.strip
            p.flesch_reading_ease = TextStat.flesch_reading_ease(p.story_text)
            p.dale_chall_readability_score = TextStat.dale_chall_readability_score(p.story_text)
            p.smog_index = TextStat.smog_index(p.story_text)
            p.difficult_words = TextStat.difficult_words(p.story_text)
            p.word_count = WordCountAnalyzer::Counter.new.mword_count(p.story_text)
            p.textmood_score = tm.analyze(p.story_text)
            p.sentimental_score = analyzer.score(p.story_text)
            p.sentiment = analyzer.sentiment(p.story_text).to_s
          end
        end
        p.updates_count = 0
        # <a href="#updates" role="tab" aria-controls="updates" aria-selected="false" id="updates-label" tabindex="-1">Updates &nbsp; <span class="badge">3</span></a>
        nok.xpath("//a[@href='#updates']/span").each do |span|
          if span.inner_text =~ /(\d+)/
            p.updates_count = $1.to_i
          end
        end
        p.created_at = 0
        nok.xpath("//div[@class='created-date']").each do |div|
          p.created_at = div.inner_text.strip
        end
        p.fb_shares = ''
        nok.xpath("//strong[@class='js-share-count-text']").each do |strong|
          p.fb_shares = strong.inner_text.strip
        end

        p.profile = ''
        nok.xpath("//a[@class='js-profile-co']").each do |a|
          p.name = a.inner_text.strip
          p.profile = a.attr('href')
        end
        p.gofundme_category = ''
        nok.xpath("//a[@class='icon-link category-link-name js-category-link']/span").each do |span|
          p.gofundme_category = span.inner_text.strip
        end
        p.location= ''
        nok.xpath("//a[@class='icon-link location-name js-location-link']").each do |a|
          a.xpath("./i").each do |i|
            i.remove
          end
          p.location = a.inner_text.gsub(/^\W+/, '').strip
        end

        p.save!
        i = 1
        nok.xpath("//div[@class='update-text']").each do |div|
          u = Update.new
          u.update_text = div.inner_text.strip
          u.update_html = div.inner_html.strip
          u.project = p
          u.links = 0
          div.xpath(".//a").each do |a|
            u.links += 1
          end
          if p.english == true
            u.flesch_reading_ease = TextStat.flesch_reading_ease(u.update_text)
            u.dale_chall_readability_score = TextStat.dale_chall_readability_score(u.update_text)
            u.smog_index = TextStat.smog_index(u.update_text)
            u.difficult_words = TextStat.difficult_words(u.update_text)
            u.word_count = WordCountAnalyzer::Counter.new.mword_count(u.update_text)
            u.textmood_score = tm.analyze(u.update_text)
            u.sentimental_score = analyzer.score(u.update_text)
            u.sentiment = analyzer.sentiment(u.update_text).to_s
          end
          #puts "Update #{i}: #{u.update_text}"
          #puts ""
          u.save!
          i += 1
        end
         puts "#{cnt}: Title: #{p.title}"
         #puts "Name: #{p.name}"
         #puts "Profile: #{p.profile}"
         #puts "Category: #{p.gofundme_category}"
         #puts "Location: #{p.location}"
         #puts "Image: #{p.image}"
         #puts "YouTube: #{p.youtube}"
         #puts "Vimeo: #{p.vimeo}"
         #puts "Images: #{p.images}"
         #puts "Shares: #{p.shares}"
         #puts "Amount: #{p.amount}"
         #puts "Goal: #{p.goal}"
         #puts "Pounds: #{p.pounds}"
         #puts "Goal pounds: #{p.goal_pounds}"
         #puts "Backers: #{p.backers}"
         #puts "Days: #{p.days}"
         #puts "Time: #{p.time}"
         #puts "Trending: #{p.trending}"
         #puts "English: #{p.english}"
        # puts "Story text: #{p.story_text}"
         #puts "flesch_reading_ease: #{p.flesch_reading_ease}"
         #puts "dale_chall_readability_score: #{p.dale_chall_readability_score}"
         #puts "smog_index: #{p.smog_index}"
         #puts "difficult_words: #{p.difficult_words}"
         #puts "word_count: #{p.word_count}"
         #puts "textmood_score: #{p.textmood_score}"
         #puts "sentimental_score: #{p.sentimental_score}"
         #puts "sentiment: #{p.sentiment}"
         #puts "Updates: #{p.updates_count}"
         #puts "Created at: #{p.created_at}"
         #puts "FB Shares: #{p.fb_shares}"
      rescue Exception => e
        puts "Exception: #{e}: #{e.backtrace}"
        puts "File: #{file}: cnt: #{cnt}"
        STDIN.gets
        STDIN.gets
        next
      end
    end
  end
end
