class ReleaseUpdate < ActiveRecord::Base
  attr_accessible :info, :status
  scope :enabled, where(status: true)
end
