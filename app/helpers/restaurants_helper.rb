module RestaurantsHelper

  def gmap(restaurants)
    gmap_addresses = ''
    restaurants.each do |restaurant|
      gmap_addresses << 'markers='+restaurant.address.gsub(' ', '+')+'&'
    end
    image_tag 'https://maps.googleapis.com/maps/api/staticmap?'+gmap_addresses+'size=800x400&maptype=roadmap'  
  end

  def addresses(restaurants)
    addresses = []
    restaurants.each do |restaurant|
      addresses << restaurant.address
    end
    addresses  
  end

  def names(restaurants)
    names = []
    restaurants.each do |restaurant|
      names << restaurant.name
    end
    names  
  end

  def restaurants_info(restaurants)
    all_info = []
    restaurants.each do |restaurant|
      info = []
      info << restaurant.name
      info << restaurant.description
      info << restaurant.address
      info << restaurant.phone
      all_info << info 
    end
    all_info
  end

end

    