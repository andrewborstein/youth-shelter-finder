class RestaurantsController < ApplicationController

  attr_accessor :gmap_address

  def index
    @restaurants = Restaurant.all
  end

  def show
    @restaurant = Restaurant.find(params[:id])
    gmap(@restaurant.address)
  end

  def new
    @restaurant = Restaurant.new  
  end

  def create
    @restaurant = Restaurant.new(restaurant_params)
    if @restaurant.save
      flash[:notice] = 'You restaurant was successfully created.' 
      redirect_to @restaurant
    else
      render action: 'new'
    end
  end

  def edit
    @restaurant = Restaurant.find(params[:id])
  end

  def update
    @restaurant = Restaurant.find(params[:id])
    if @restaurant.update_attributes(restaurant_params)
      flash[:notice] = 'You restaurant was successfully edited.' 
      redirect_to @restaurant
    else
      render action: 'edit'
    end
  end

  def destroy
    @restaurant = Restaurant.find(params[:id])
    @restaurant.destroy
    redirect_to restaurants_path, notice: 'Restaurant was successfully deleted.'
  end

  def gmap(value)
    @gmap = 'https://maps.googleapis.com/maps/api/staticmap?markers='+value.gsub(' ', '+')+'&zoom=13&size=400x200&maptype=roadmap'
  end

  def gmap_markers(value)
    @gmap_markers = 'https://maps.googleapis.com/maps/api/staticmap?'+@gmaps_addresses+'size=800x400&maptype=roadmap'  
  end


  private

  def restaurant_params
    params.require(:restaurant).permit(:name, :description, :address, :phone)
  end

end
