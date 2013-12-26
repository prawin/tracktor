class AddWhatsNew20131226 < ActiveRecord::Migration
  def up
    ReleaseUpdate.update_all(:status => false)
    ReleaseUpdate.create(:info => "Made current sprint available in planning mode.")
    ReleaseUpdate.create(:info => "Finish sprint button now available for admins only.")
    ReleaseUpdate.create(:info => "Moved notification messages to top.")
  end

  def down
  end
end
