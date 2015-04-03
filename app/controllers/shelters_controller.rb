class SheltersController < ApplicationController

  before_action :set_shelter, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, except: [:index, :show]
  before_action :correct_user, only: [:edit, :update, :destroy]
  before_action :owner, only: [:new]

  attr_accessor :gmap_address

  def index
    @shelters = Shelter.all
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @shelters }
    end
  end

  def show
    gmap(@shelter.address)
  end

  def new
    @shelter = current_user.shelters.build
  end

  def create

    @shelter = current_user.shelters.build(shelter_params)
    if @shelter.save
      flash[:success] = "'#{@shelter.name}' was successfully created."
      redirect_to @shelter
    else
      render action: 'new'
    end
  end

  def edit
  end

  def update
    if @shelter.update_attributes(shelter_params)
      flash[:success] = "'#{@shelter.name}' was successfully edited."
      redirect_to @shelter
    else
      render action: 'edit'
    end
  end

  def destroy
    @shelter.destroy
    redirect_to shelters_path, success: "'#{@shelter.name}' was successfully deleted."
  end

  def gmap(value)
    @gmap = 'https://maps.googleapis.com/maps/api/staticmap?markers='+value.gsub(' ', '+')+'&zoom=13&size=400x200&maptype=roadmap'
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_shelter
    @shelter = Shelter.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def shelter_params
    params.require(:shelter).permit(:name, :description, :address, :phone, :gender, :free_bed)
  end

  # Allow modifications only for that shelter's owner, aka the correct user
  def correct_user
    @shelter = current_user.shelters.find_by(id: params[:id])
    redirect_to shelter_path, notice: 'Woah there! That shelter belongs to someone else.' if @shelter.nil?
  end

  # Allow modifications only for that owners, not users
  def owner
    redirect_to shelters_path, notice: 'Woah there! Only owners can create shelters.' if current_user.owner == false
  end

end
