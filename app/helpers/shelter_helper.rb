module ShelterHelper

  def availability_popover_class(shelter)
    if shelter.free_bed.nil?
      "default"
    else
      if shelter.free_bed > 9
        "success"
      elsif shelter.free_bed < 5 && shelter.free_bed > 1
        "danger"
      elsif shelter.free_bed < 2
        "danger"
      else
        "warning"
      end
    end
  end

  def availability_popover_content(shelter)
    if shelter.free_bed.nil?
      "We don't have any information about current bed availability."
    else
      if shelter.free_bed == 1
        "There is #{shelter.free_bed} bed currently available."
      else
        "There are #{shelter.free_bed} beds currently available."
      end
    end
  end

  def availability_popover_title(shelter)
    if shelter.free_bed.nil?
      "Unknown Availability"
    else
      if shelter.free_bed > 10
        "High Availability"
      elsif shelter.free_bed < 5 && shelter.free_bed > 1
        "Low Availability"
      elsif shelter.free_bed < 2
        "One Bed Left"
      else
        "Medium Availability"
      end
    end
  end

  def free_beds(shelter)
    shelter.free_bed ? shelter.free_bed : "?"
  end

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

  def no_bed_info(shelter)
    shelter.free_bed.nil?
  end

  def shelter_name_id(name)
    name.downcase.gsub('\'','').gsub(' ','')
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


