#!/usr/bin/env ruby

require 'axlsx'

namespace :data do
  task :export => :environment do
    desc "Export records into Excel for analysis"
    STDERR.puts "Creating spreadsheet..."
    p = Axlsx::Package.new
    p.workbook.add_worksheet(:name => "Campaigns") do |sheet|
      fields = %w/created_at gofundme_key gofundme_category completed title name profile location image youtube vimeo images shares amount goal pounds goal_pounds euros goal_euros backers time trending english story_text link_count flesch_reading_ease dale_chall_readability_score smog_index difficult_words word_count textmood_score sentimental_score sentiment updates_count fb_shares hearted star_rating category updated_at/
      sheet.add_row fields
      Project.where("category in ('mtf', 'ftm')").each do |project|
        arr = []
        fields.each do |field|
          arr.push project.send(field.to_sym)
        end
        STDERR.puts project.title
        sheet.add_row arr
      end
    end
    p.use_shared_strings = true
    STDERR.puts "Saving gofundme_campaigns.xlsx"
    p.serialize('gofundme_campaigns.xlsx')
  end
end

