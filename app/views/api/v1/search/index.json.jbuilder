json.project @project
json.graphs do
  json.sentimental_score Project.graph(:sentimental_score)
  json.textmood_score Project.graph(:textmood_score)
  json.word_count Project.graph(:word_count)
  json.difficult_words Project.graph(:difficult_words)
  json.flesch_reading_ease Project.graph(:flesch_reading_ease)
  json.dale_chall_readability_score Project.graph(:dale_chall_readability_score)
  json.smog_index Project.graph(:smog_index)
  json.link_count Project.graph(:link_count)
  json.updates_count Project.graph(:updates_count)
end
json.status do
  json.code @code
  json.message @message
end
