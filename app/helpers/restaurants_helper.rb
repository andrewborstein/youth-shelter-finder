module RestaurantsHelper

  def gmap(restaurants)
    gmaps_addresses = ''
    restaurants.each do |restaurant|
      gmaps_addresses << 'markers='+restaurant.address.gsub(' ', '+')+'&'
    end
    image_tag 'https://maps.googleapis.com/maps/api/staticmap?'+gmaps_addresses+'size=800x400&maptype=roadmap'  
  end

end

    