class RestaurantsController < ApplicationController

  before_action :set_restaurant, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, except: [:index, :show]
  before_action :correct_user, only: [:edit, :update, :destroy]

  attr_accessor :gmap_address

  def index
    @restaurants = Restaurant.all
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @restaurants }
    end
  end

  def show
    gmap(@restaurant.address)
  end

  def new
    @restaurant = current_user.restaurants.build
  end

  def create

    @restaurant = current_user.restaurants.build(restaurant_params)
    if @restaurant.save
      flash[:success] = "'#{@restaurant.name}' was successfully created."
      redirect_to @restaurant
    else
      render action: 'new'
    end
  end

  def edit
  end

  def update
    if @restaurant.update_attributes(restaurant_params)
      flash[:success] = "'#{@restaurant.name}' was successfully edited."
      redirect_to @restaurant
    else
      render action: 'edit'
    end
  end

  def destroy
    @restaurant.destroy
    redirect_to restaurants_path, success: "'#{@restaurant.name}' was successfully deleted."
  end

  def gmap(value)
    @gmap = 'https://maps.googleapis.com/maps/api/staticmap?markers='+value.gsub(' ', '+')+'&zoom=13&size=400x200&maptype=roadmap'
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_restaurant
    @restaurant = Restaurant.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def restaurant_params
    params.require(:restaurant).permit(:name, :description, :address, :phone)
  end

  # Allow pin modifications only for that pin's author, aka the correct user
  def correct_user
    @restaurant = current_user.restaurants.find_by(id: params[:id])
    redirect_to restaurant_path, notice: 'Woah there! Only owners can manage restaurants.' if @restaurant.nil?
  end

end
