class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :restaurants
  
  validates :name, presence: true

  def pass(arg)
    arg
  end

  def score(grade)
    if(grade == "A" or grade == "B" || grade == "C" || grade == "D")
      true
    else
      false
    end
  end

end