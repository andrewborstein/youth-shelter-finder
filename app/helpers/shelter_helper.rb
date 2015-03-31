module ShelterHelper

  def gmap(shelters)
    gmap_addresses = ''
    shelters.each do |shelter|
      gmap_addresses << 'markers='+shelter.address.gsub(' ', '+')+'&'
    end
    image_tag 'https://maps.googleapis.com/maps/api/staticmap?'+gmap_addresses+'size=800x400&maptype=roadmap'  
  end

  def addresses(shelters)
    addresses = []
    shelters.each do |shelter|
      addresses << shelter.address
    end
    addresses  
  end

  def names(shelters)
    names = []
    shelters.each do |shelter|
      names << shelter.name
    end
    names  
  end

  def shelters_info(shelters)
    all_info = []
    shelters.each do |shelter|
      info = []
      info << shelter.name
      info << shelter.description
      info << shelter.address
      info << shelter.phone
      all_info << info 
    end
    all_info
  end

end

    