class AddReleaseUpdate < ActiveRecord::Migration
  def up
    ReleaseUpdate.update_all(:status => false)
    ReleaseUpdate.create :info => "This whats new panel ;)"
    ReleaseUpdate.create :info => "Redsigned login page with whats new panel."
    ReleaseUpdate.create :info => "'Assign To' button on Issue show page."
  end

  def down
  end
end
